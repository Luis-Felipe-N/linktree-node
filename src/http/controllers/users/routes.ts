import { FastifyInstance } from 'fastify'
import { register } from './register.controller'
import { authenticate } from './authenticate.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.get('/me', authenticate)
}
