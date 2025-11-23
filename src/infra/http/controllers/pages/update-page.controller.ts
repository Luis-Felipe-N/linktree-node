import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdatePageUseCase } from '../../../factories/make-update-page-use-case'
import { ResourceNotFoundError } from '../../../../domain/application/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '../../../../domain/application/use-cases/errors/unauthorized-error'
import { PagePresenter } from '../../presenters/page-presenter'

export async function updatePage(request: FastifyRequest, reply: FastifyReply) {
  const updatePageParamsSchema = z.object({
    pageId: z.string().uuid(),
  })

  const updatePageBodySchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    slug: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
  })

  const { pageId } = updatePageParamsSchema.parse(request.params)
  const { title, description, slug } = updatePageBodySchema.parse(request.body)

  const userId = request.user.sub

  try {
    const updatePageUseCase = makeUpdatePageUseCase()

    const { page } = await updatePageUseCase.execute({
      pageId,
      userId,
      title,
      description,
      slug,
    })

    return reply.status(200).send({
      page: PagePresenter.toHTTP(page),
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof UnauthorizedError) {
      return reply.status(403).send({ message: err.message })
    }

    throw err
  }
}
