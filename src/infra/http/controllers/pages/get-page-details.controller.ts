import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetPageDetailsUseCase } from 'src/infra/factories/make-get-page-details-use-case'
import { makeFetchLinksByPageUseCase } from 'src/infra/factories/make-fetch-links-by-page-use-case'
import { ResourceNotFoundError } from 'src/domain/application/use-cases/errors/resource-not-found-error'
import { PagePresenter } from 'src/infra/http/presenters/page-presenter'
import { LinkPresenter } from 'src/infra/http/presenters/link-presenter'

export async function getPageDetails(request: FastifyRequest, reply: FastifyReply) {
  const getPageDetailsParamsSchema = z.object({
    slug: z.string(),
  })

  const validationResult = getPageDetailsParamsSchema.safeParse(request.params)

  if (!validationResult.success) {
    return reply
      .status(400)
      .send({ message: 'Invalid slug parameter', issues: validationResult.error.format() })
  }

  const { slug } = validationResult.data

  try {
    const getPageDetailsUseCase = makeGetPageDetailsUseCase()
    const { page } = await getPageDetailsUseCase.execute({ slug })

    return reply.status(200).send({
      page: PagePresenter.toHTTP(page),
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Page not found.' })
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}