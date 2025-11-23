import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

import { makeSearchUserUseCase } from '../../../factories/make-search-user-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
  })

  const { email, username } = searchQuerySchema.parse(request.query)

  const searchUserUseCase = makeSearchUserUseCase()

  const { existing } = await searchUserUseCase.execute({ email, username })

  return reply.status(200).send({
    existing: existing,
  })
}
