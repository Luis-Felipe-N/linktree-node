import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetPageDetailsUseCase } from '../../../factories/make-get-page-details-use-case'
import { ResourceNotFoundError } from '../../../../domain/application/use-cases/errors/resource-not-found-error'
import { PagePresenter } from '../../presenters/page-presenter'

export async function getPageBySlug(request: FastifyRequest, reply: FastifyReply) {
  const getPageBySlugParamsSchema = z.object({
    slug: z.string().min(3).max(100),
  })

  const validationResult = getPageBySlugParamsSchema.safeParse(request.params)

  if (!validationResult.success) {
    return reply
      .status(400)
      .send({ message: 'Invalid page slug', issues: validationResult.error.format() })
  }

  const { slug } = validationResult.data

  try {
    const getPageDetailsUseCase = makeGetPageDetailsUseCase()
    const { page } = await getPageDetailsUseCase.execute({ slug })

    return reply.status(200).send({ page: PagePresenter.toHTTP(page) })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Page not found.' })
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
