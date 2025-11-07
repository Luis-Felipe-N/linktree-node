import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreatePageUseCase } from '@/use-cases/factories/make-create-page-use-case'
import { PageSlugAlreadyExistsError } from '@/use-cases/errors/page-slug-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { PagePresenter } from '@/http/presenters/page-presenter'

export async function createPage(request: FastifyRequest, reply: FastifyReply) {
  // Assumindo que verifyJWT adiciona 'sub' ao objeto 'user' da requisição
  if (!request.user || !request.user.sub) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  const createPageBodySchema = z.object({
    slug: z
      .string()
      .min(3)
      .regex(
        /^[a-z0-9-]+$/,
        'Slug must contain only lowercase letters, numbers, and hyphens',
      ),
    title: z.string().optional(),
    description: z.string().max(160).optional(), // Limitar descrição
    imageUrl: z.string().url().optional(),
  })

  const validationResult = createPageBodySchema.safeParse(request.body)

  if (!validationResult.success) {
    return reply
      .status(400)
      .send({ message: 'Validation Error', issues: validationResult.error.format() })
  }

  const { slug, title, description, imageUrl } = validationResult.data

  try {
    const createPageUseCase = makeCreatePageUseCase()
    const { page } = await createPageUseCase.execute({
      ownerId: request.user.sub,
      slug,
      title,
      description,
      imageUrl,
    })
    
    return reply.status(201).send({ page: PagePresenter.toHTTP(page) })
  } catch (error) {
    if (error instanceof PageSlugAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof ResourceNotFoundError) {
      // O User deveria existir se passou pelo JWT, então isso seria inesperado
      console.error('Owner user not found during page creation:', request.user.sub);
      return reply.status(404).send({ message: 'Owner user not found.' })
    }
    console.error(error) // Log erro interno
    return reply.status(500).send({ message: 'Internal server error' })
  }
}