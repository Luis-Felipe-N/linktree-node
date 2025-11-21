import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-links-repository'
import { FetchLinksByPageUseCase } from './fetch-links-by-page.usecase'
import { Link } from '@/domain/enterprise/entities/link.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let linksRepository: InMemoryLinksRepository
let sut: FetchLinksByPageUseCase

describe('FetchLinksByPageUseCase', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository()
    sut = new FetchLinksByPageUseCase(linksRepository)
  })

  it('should be able to fetch links from a page', async () => {
    const link1 = Link.create({
      pageId: new UniqueEntityID('page-123'),
      url: 'https://github.com/test',
      title: 'GitHub',
      order: 0,
    })

    const link2 = Link.create({
      pageId: new UniqueEntityID('page-123'),
      url: 'https://linkedin.com/test',
      title: 'LinkedIn',
      order: 1,
    })

    await linksRepository.create(link1)
    await linksRepository.create(link2)

    const result = await sut.execute({ pageId: 'page-123' })

    expect(result.links).toHaveLength(2)
    expect(result.links[0].title).toBe('GitHub')
    expect(result.links[1].title).toBe('LinkedIn')
  })

  it('should return links in correct order', async () => {
    // Create links in reverse order
    const link3 = Link.create({
      pageId: new UniqueEntityID('page-123'),
      url: 'https://twitter.com/test',
      title: 'Twitter',
      order: 2,
    })

    const link1 = Link.create({
      pageId: new UniqueEntityID('page-123'),
      url: 'https://github.com/test',
      title: 'GitHub',
      order: 0,
    })

    const link2 = Link.create({
      pageId: new UniqueEntityID('page-123'),
      url: 'https://linkedin.com/test',
      title: 'LinkedIn',
      order: 1,
    })

    await linksRepository.create(link3)
    await linksRepository.create(link1)
    await linksRepository.create(link2)

    const result = await sut.execute({ pageId: 'page-123' })

    expect(result.links).toHaveLength(3)
    expect(result.links[0].order).toBe(0)
    expect(result.links[1].order).toBe(1)
    expect(result.links[2].order).toBe(2)
    expect(result.links[0].title).toBe('GitHub')
    expect(result.links[1].title).toBe('LinkedIn')
    expect(result.links[2].title).toBe('Twitter')
  })

  it('should return empty array if page has no links', async () => {
    const result = await sut.execute({ pageId: 'page-123' })

    expect(result.links).toHaveLength(0)
  })

  it('should not return links from other pages', async () => {
    const link1 = Link.create({
      pageId: new UniqueEntityID('page-1'),
      url: 'https://github.com/test1',
      order: 0,
    })

    const link2 = Link.create({
      pageId: new UniqueEntityID('page-2'),
      url: 'https://github.com/test2',
      order: 0,
    })

    await linksRepository.create(link1)
    await linksRepository.create(link2)

    const result = await sut.execute({ pageId: 'page-1' })

    expect(result.links).toHaveLength(1)
    expect(result.links[0].url).toBe('https://github.com/test1')
  })
})
