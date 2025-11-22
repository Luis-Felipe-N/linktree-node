import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryLinksRepository } from 'src/repositories/in-memory/in-memory-links-repository'
import { InMemoryPagesRepository } from 'src/repositories/in-memory/in-memory-pages-repository'
import { AddLinkToPageUseCase } from './add-link-to-page.usecase'
import { Page } from 'src/domain/enterprise/entities/page.entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'

let linksRepository: InMemoryLinksRepository
let pagesRepository: InMemoryPagesRepository
let sut: AddLinkToPageUseCase

describe('AddLinkToPageUseCase', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository()
    pagesRepository = new InMemoryPagesRepository()
    sut = new AddLinkToPageUseCase(linksRepository, pagesRepository)
  })

  it('should be able to add a link to a page', async () => {
    const userId = 'user-123'
    const page = Page.create(
      {
        ownerId: new UniqueEntityID(userId),
        slug: 'test-page',
        title: 'Test Page',
      },
      new UniqueEntityID('page-123')
    )

    await pagesRepository.create(page)

    const result = await sut.execute({
      userId,
      pageId: 'page-123',
      url: 'https://github.com/test',
      title: 'GitHub Profile',
    })

    expect(result.link).toBeTruthy()
    expect(result.link.url).toBe('https://github.com/test')
    expect(result.link.title).toBe('GitHub Profile')
    expect(result.link.order).toBe(0)
    expect(result.link.pageId.toString()).toBe('page-123')
  })

  it('should assign correct order when adding multiple links', async () => {
    const userId = 'user-123'
    const page = Page.create(
      {
        ownerId: new UniqueEntityID(userId),
        slug: 'test-page',
      },
      new UniqueEntityID('page-123')
    )

    await pagesRepository.create(page)

    const link1 = await sut.execute({
      userId,
      pageId: 'page-123',
      url: 'https://github.com/test',
      title: 'GitHub',
    })

    const link2 = await sut.execute({
      userId,
      pageId: 'page-123',
      url: 'https://linkedin.com/test',
      title: 'LinkedIn',
    })

    const link3 = await sut.execute({
      userId,
      pageId: 'page-123',
      url: 'https://twitter.com/test',
      title: 'Twitter',
    })

    expect(link1.link.order).toBe(0)
    expect(link2.link.order).toBe(1)
    expect(link3.link.order).toBe(2)
  })

  it('should not be able to add a link to a non-existent page', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-123',
        pageId: 'non-existent-page',
        url: 'https://github.com/test',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a link if user is not the page owner', async () => {
    const page = Page.create(
      {
        ownerId: new UniqueEntityID('owner-123'),
        slug: 'test-page',
      },
      new UniqueEntityID('page-123')
    )

    await pagesRepository.create(page)

    await expect(() =>
      sut.execute({
        userId: 'different-user-123',
        pageId: 'page-123',
        url: 'https://github.com/test',
      })
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should be able to add a link with optional fields', async () => {
    const userId = 'user-123'
    const page = Page.create(
      {
        ownerId: new UniqueEntityID(userId),
        slug: 'test-page',
      },
      new UniqueEntityID('page-123')
    )

    await pagesRepository.create(page)

    const scheduledStart = new Date('2025-12-01')
    const scheduledEnd = new Date('2025-12-31')

    const result = await sut.execute({
      userId,
      pageId: 'page-123',
      url: 'https://github.com/test',
      title: 'GitHub Profile',
      thumbnailUrl: 'https://example.com/thumb.png',
      highlightEffect: 'pulse',
      scheduledStart,
      scheduledEnd,
      type: 'embed',
    })

    expect(result.link.thumbnailUrl).toBe('https://example.com/thumb.png')
    expect(result.link.highlightEffect).toBe('pulse')
    expect(result.link.scheduledStart).toEqual(scheduledStart)
    expect(result.link.scheduledEnd).toEqual(scheduledEnd)
    expect(result.link.type).toBe('embed')
  })
})
