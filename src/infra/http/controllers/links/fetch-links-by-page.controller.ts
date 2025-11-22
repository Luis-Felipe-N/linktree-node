import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from 'src/domain/application/use-cases/errors/resource-not-found-error'
import { LinkPresenter } from 'src/infra/http/presenters/link-presenter'
import { makeFetchLinksByPageUseCase } from 'src/infra/factories/make-fetch-links-by-page-use-case'

export async function fetchLinksByPage(request: FastifyRequest, reply: FastifyReply) {
  const fetchLinksParamsSchema = z.object({
    pageId: z.string().uuid(),
  })

  const paramsValidation = fetchLinksParamsSchema.safeParse(request.params)

  if (!paramsValidation.success) {
    return reply.status(400).send({
      message: 'Invalid page ID.',
      issues: paramsValidation.error.format()
    })
  }

  const { pageId } = paramsValidation.data

  try {
    const fetchLinksByPageUseCase = makeFetchLinksByPageUseCase()
    const { links } = await fetchLinksByPageUseCase.execute({ pageId })

    return reply.status(200).send({
      links: LinkPresenter.toHTTPList(links)
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Page not found.' })
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}