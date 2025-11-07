import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserPagesUseCase } from '@/use-cases/factories/make-get-user-pages-use-case'

/**
 * GET /me/pages
 * 
 * Lista todas as páginas do usuário autenticado.
 */
export async function getUserPages(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // @ts-expect-error - JWT plugin adds user to request
  if (!request.user || !request.user.sub) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  try {
    const getUserPagesUseCase = makeGetUserPagesUseCase()

    // @ts-expect-error - JWT plugin adds user to request
    const userId = request.user.sub

    const { pages } = await getUserPagesUseCase.execute({ userId })

    return reply.status(200).send({ pages })
  } catch (error) {
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
