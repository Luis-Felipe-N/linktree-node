import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserPagesUseCase } from '@/use-cases/factories/make-get-user-pages-use-case'
import { PagePresenter } from '@/http/presenters/page-presenter'

export async function getUserPages(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  if (!request.user || !request.user.sub) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  try {
    const getUserPagesUseCase = makeGetUserPagesUseCase()

    const userId = request.user.sub

    const { pages } = await getUserPagesUseCase.execute({ userId })

    return reply.status(200).send({ pages: PagePresenter.toHTTPListWithOwner(pages) })
  } catch (error) {
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
