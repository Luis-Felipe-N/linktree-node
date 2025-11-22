import { FastifyInstance } from 'fastify'
import { register } from './register.controller'
import { search } from './search.controller'
import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { verifyJWT } from 'src/infra/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/users/search', search)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
