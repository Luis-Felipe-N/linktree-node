import { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  createTestApp,
  cleanDatabase,
  createTestUser,
  authenticateUser,
  createTestPage,
} from '@/test/helpers'

describe('Add Link to Page (E2E)', () => {
  let app: FastifyInstance
  let token: string
  let pageId: string
  let username: string

  beforeAll(async () => {
    app = await createTestApp()
  })

  beforeEach(async () => {
    await cleanDatabase()

    username = `testuser${Date.now()}`
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        username,
        password: '123456',
      },
    })

    token = await authenticateUser(app, username, '123456')
    const page = await createTestPage(app, token)
    pageId = page.id
  })

  afterAll(async () => {
    await cleanDatabase()
    await app.close()
  })

  it('should be able to add a link to a page', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://github.com/test',
        title: 'GitHub Profile',
      },
    })

    expect(response.statusCode).toBe(201)

    const body = JSON.parse(response.body)
    expect(body.link).toBeTruthy()
    expect(body.link.url).toBe('https://github.com/test')
    expect(body.link.title).toBe('GitHub Profile')
    expect(body.link.order).toBe(0)
    expect(body.link.pageId).toBe(pageId)
  })

  it('should be able to add multiple links with correct order', async () => {
    const link1Response = await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://github.com/test',
        title: 'GitHub',
      },
    })

    const link2Response = await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://linkedin.com/test',
        title: 'LinkedIn',
      },
    })

    const link1 = JSON.parse(link1Response.body).link
    const link2 = JSON.parse(link2Response.body).link

    expect(link1.order).toBe(0)
    expect(link2.order).toBe(1)
  })

  it('should not be able to add a link without authentication', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      payload: {
        url: 'https://github.com/test',
        title: 'GitHub',
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should not be able to add a link to non-existent page', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/pages/00000000-0000-0000-0000-000000000000/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://github.com/test',
        title: 'GitHub',
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not be able to add a link to another user page', async () => {
    // Create another user
    const anotherUsername = `anotheruser${Date.now()}`
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Another User',
        email: `another${Date.now()}@example.com`,
        username: anotherUsername,
        password: '123456',
      },
    })

    const anotherToken = await authenticateUser(app, anotherUsername, '123456')

    // Try to add link to first user's page
    const response = await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${anotherToken}`,
      },
      payload: {
        url: 'https://github.com/test',
        title: 'GitHub',
      },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should be able to add a link with optional fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://github.com/test',
        title: 'GitHub Profile',
        thumbnailUrl: 'https://example.com/thumb.png',
        highlightEffect: 'pulse',
        type: 'embed',
      },
    })

    expect(response.statusCode).toBe(201)
    
    const body = JSON.parse(response.body)
    expect(body.link.thumbnailUrl).toBe('https://example.com/thumb.png')
    expect(body.link.highlightEffect).toBe('pulse')
    expect(body.link.type).toBe('embed')
  })

  it('should return 400 for invalid URL', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'not-a-valid-url',
        title: 'Invalid',
      },
    })

    expect(response.statusCode).toBe(400)
  })
})
