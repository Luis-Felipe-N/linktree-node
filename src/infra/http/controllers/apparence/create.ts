import { makeCreateThemeUseCase } from '../../../factories/make-create-theme-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createThemeBodySchema = z.object({
    title: z.string(),
    backgroundId: z.string().nullable(),
    buttonId: z.string().nullable(),
  })

  const { backgroundId, buttonId, title } = createThemeBodySchema.parse(
    request.body,
  )

  const createThemeUseCase = makeCreateThemeUseCase()
  await createThemeUseCase.execute({
    title,
    userId: request.user.sub,
    buttonId,
    backgroundId,
  })

  return reply.status(201).send()
}
