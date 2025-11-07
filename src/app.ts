import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { usersRoutes } from './http/controllers/users/routes'
import { pagesRoutes } from './http/controllers/pages/routes'

export const app = fastify()

app.register(cors, {
  // put your options here
})

app.register(fastifyJwt, {
  secret: env.SECRET_KEY,
})

app.register(usersRoutes)
app.register(pagesRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  } else {
    // Mandar o error para algum serviço de tratamento
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
