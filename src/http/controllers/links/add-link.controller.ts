import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAddLinkToPageUseCase } from '@/use-cases/factories/make-add-link-to-page-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository' // Para verificar propriedade

export async function addLink(request: FastifyRequest, reply: FastifyReply) {
   if (!request.user || !request.user.sub) {
     return reply.status(401).send({ message: 'Unauthorized.' })
   }

  const addLinkParamsSchema = z.object({
    pageId: z.string().uuid(),
  })
  const addLinkBodySchema = z.object({
    url: z.string().url({ message: 'Invalid URL format.' }),
    title: z.string().max(100).optional(),
    order: z.number().int().min(0), // Idealmente, buscar a última ordem + 1 no use case
    thumbnailUrl: z.string().url().optional(),
    highlightEffect: z.string().optional(), // Poderia ser um enum: z.enum(['shake', 'pulse']).optional()
  })

  const paramsValidation = addLinkParamsSchema.safeParse(request.params)
  const bodyValidation = addLinkBodySchema.safeParse(request.body)

  if (!paramsValidation.success) {
    return reply.status(400).send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() })
  }
  if (!bodyValidation.success) {
    return reply.status(400).send({ message: 'Invalid link data.', issues: bodyValidation.error.format() })
  }

  const { pageId } = paramsValidation.data
  const { url, title, order, thumbnailUrl, highlightEffect } = bodyValidation.data

  try {
    // --- Verificação de Propriedade ---
    const pagesRepository = new PrismaPagesRepository() // Instanciar diretamente ou via factory
    const page = await pagesRepository.findById(pageId)
    if (!page) {
       throw new ResourceNotFoundError(); // Página não encontrada
    }
    if (page.ownerId !== request.user.sub) {
      return reply.status(403).send({ message: 'Forbidden: You do not own this page.' })
    }
    // --- Fim Verificação ---

    const addLinkUseCase = makeAddLinkToPageUseCase()
    const { link } = await addLinkUseCase.execute({
      pageId,
      url,
      title,
      order, // Considerar lógica automática de ordem no Use Case
      thumbnailUrl,
      highlightEffect,
    })
    return reply.status(201).send({ link })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Page not found.' }) // O erro pode vir da verificação ou do use case
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}