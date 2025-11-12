import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FastifyInstance } from 'fastify'
import {
  createTestApp,
  cleanDatabase,
  createTestUser,
  authenticateUser,
  createTestPage,
} from '@/test/helpers'

describe('Fetch Links by Page (E2E)', () => {
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

  it('should be able to fetch links from a page', async () => {
    // Add some links first
    await app.inject({
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

    await app.inject({
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

    // Fetch links
    const response = await app.inject({
      method: 'GET',
      url: `/pages/${pageId}/links`,
    })

    expect(response.statusCode).toBe(200)

    const body = JSON.parse(response.body)
    expect(body.links).toHaveLength(2)
    expect(body.links[0].title).toBe('GitHub')
    expect(body.links[0].order).toBe(0)
    expect(body.links[1].title).toBe('LinkedIn')
    expect(body.links[1].order).toBe(1)
  })

  it('should return links in correct order', async () => {
    // Add links
    await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://github.com/test',
        title: 'First Link',
      },
    })

    await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://linkedin.com/test',
        title: 'Second Link',
      },
    })

    await app.inject({
      method: 'POST',
      url: `/pages/${pageId}/links`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        url: 'https://twitter.com/test',
        title: 'Third Link',
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: `/pages/${pageId}/links`,
    })

    const body = JSON.parse(response.body)
    expect(body.links).toHaveLength(3)
    expect(body.links[0].order).toBe(0)
    expect(body.links[1].order).toBe(1)
    expect(body.links[2].order).toBe(2)
    expect(body.links[0].title).toBe('First Link')
    expect(body.links[1].title).toBe('Second Link')
    expect(body.links[2].title).toBe('Third Link')
  })

  it('should return empty array if page has no links', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/pages/${pageId}/links`,
    })

    expect(response.statusCode).toBe(200)

    const body = JSON.parse(response.body)
    expect(body.links).toHaveLength(0)
  })

  it('should return 404 for non-existent page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/pages/00000000-0000-0000-0000-000000000000/links`,
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 400 for invalid page ID', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/pages/invalid-uuid/links`,
    })

    expect(response.statusCode).toBe(400)
  })

  it('should not require authentication to fetch links', async () => {
    // Add a link
    await app.inject({
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

    // Fetch without token
    const response = await app.inject({
      method: 'GET',
      url: `/pages/${pageId}/links`,
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.links).toHaveLength(1)
  })
})
