import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdatePageThemeUseCase } from '@/use-cases/factories/make-update-page-theme-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository' // Para verificar propriedade

export async function updateTheme(request: FastifyRequest, reply: FastifyReply) {
   if (!request.user || !request.user.sub) {
     return reply.status(401).send({ message: 'Unauthorized.' })
   }

  const updateThemeParamsSchema = z.object({
    pageId: z.string().uuid(),
  })
  // Schema permite que IDs sejam null ou não enviados (undefined)
  const updateThemeBodySchema = z.object({
    themeTitle: z.string().min(1).max(50),
    backgroundId: z.string().uuid().nullable().optional(),
    buttonId: z.string().uuid().nullable().optional(),
  })

  const paramsValidation = updateThemeParamsSchema.safeParse(request.params)
  const bodyValidation = updateThemeBodySchema.safeParse(request.body)

   if (!paramsValidation.success) {
     return reply.status(400).send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() })
   }
   if (!bodyValidation.success) {
     return reply.status(400).send({ message: 'Invalid theme data.', issues: bodyValidation.error.format() })
   }


  const { pageId } = paramsValidation.data
  const { themeTitle, backgroundId, buttonId } = bodyValidation.data

  try {
     // --- Verificação de Propriedade ---
     const pagesRepository = new PrismaPagesRepository()
     const page = await pagesRepository.findById(pageId)
     if (!page) {
        throw new ResourceNotFoundError('Page not found.'); // Erro específico
     }
     if (page.ownerId !== request.user.sub) {
       return reply.status(403).send({ message: 'Forbidden: You do not own this page.' })
     }
     // --- Fim Verificação ---

    const updateThemeUseCase = makeUpdatePageThemeUseCase()
    const { theme } = await updateThemeUseCase.execute({
      pageId,
      themeTitle,
      backgroundId: backgroundId, // Passa null, undefined ou o ID
      buttonId: buttonId, // Passa null, undefined ou o ID
    })
    return reply.status(200).send({ theme })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      // O erro pode vir da verificação da página, background ou button
      return reply.status(404).send({ message: error.message })
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}