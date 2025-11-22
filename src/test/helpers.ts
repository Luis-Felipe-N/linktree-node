import { FastifyInstance } from 'fastify'
import { app } from 'src/app'
import { prisma } from 'src/lib/prisma'

export async function createTestApp(): Promise<FastifyInstance> {
  await app.ready()
  return app
}

export async function cleanDatabase() {
  await prisma.link.deleteMany()
  await prisma.theme.deleteMany()
  await prisma.background.deleteMany()
  await prisma.button.deleteMany()
  await prisma.page.deleteMany()
  await prisma.user.deleteMany()
}

export async function createTestUser(app: FastifyInstance) {
  const response = await app.inject({
    method: 'POST',
    url: '/users',
    payload: {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      password: '123456',
    },
  })

  return JSON.parse(response.body)
}

export async function authenticateUser(app: FastifyInstance, username: string, password: string) {
  const response = await app.inject({
    method: 'POST',
    url: '/sessions',
    payload: {
      username,
      password,
    },
  })

  const body = JSON.parse(response.body)

  return body.token
}

export async function createTestPage(app: FastifyInstance, token: string, slug?: string) {
  const response = await app.inject({
    method: 'POST',
    url: '/pages',
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      slug: slug || `test-page-${Date.now()}`,
      title: 'Test Page',
      description: 'Test Description',
    },
  })

  const body = JSON.parse(response.body)
  return body.page
}
