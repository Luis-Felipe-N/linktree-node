import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'
import { InvalidCredentialsError } from '../../../../domain/application/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '../../../factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    username: z.string(),
    password: z.string().min(6),
  })

  const { username, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ username, password })


    const token = await reply.jwtSign({ sub: user.id.toString() })
    return reply.status(200).send({
      token,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
