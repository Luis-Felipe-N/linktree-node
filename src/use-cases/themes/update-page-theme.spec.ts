import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPagesRepository } from '@/repositories/in-memory/in-memory-pages-repository'
import { InMemoryThemesRepository } from '@/repositories/in-memory/in-memory-themes-repository'
import { InMemoryBackgroundRepository } from '@/repositories/in-memory/in-memory-background-repository'
import { InMemoryButtonRepository } from '@/repositories/in-memory/in-memory-button-repository'
import { UpdatePageThemeUseCase } from './update-page-theme.usecase'
import { Page } from '@/domain/enterprise/entities/page.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let pagesRepository: InMemoryPagesRepository
let themesRepository: InMemoryThemesRepository
let backgroundRepository: InMemoryBackgroundRepository
let buttonRepository: InMemoryButtonRepository
let sut: UpdatePageThemeUseCase

describe('UpdatePageThemeUseCase', () => {
  beforeEach(() => {
    pagesRepository = new InMemoryPagesRepository()
    themesRepository = new InMemoryThemesRepository()
    backgroundRepository = new InMemoryBackgroundRepository()
    buttonRepository = new InMemoryButtonRepository()
    sut = new UpdatePageThemeUseCase(
      pagesRepository,
      themesRepository,
      backgroundRepository,
      buttonRepository,
    )
  })

  it('should be able to update page theme with background and button', async () => {
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

    const themeData = {
      key: 'new-york',
      editable: true,
      luminance: 'DARK',
      background: {
        type: 'gradient',
        gradientStart: '#1a1a1a',
        gradientEnd: '#2d2d2d',
        gradientDirection: 'to bottom',
      },
      button: {
        style: 'filled',
        color: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Inter',
        fontWeight: 'bold',
      },
    }

    const result = await sut.execute({
      pageId: 'page-123',
      ownerId: userId,
      themeData,
    })

    expect(result.success).toBe(true)
    expect(result.theme).toBeTruthy()
    expect(result.theme.pageId.toString()).toBe('page-123')
    expect(result.theme.title).toBe('new-york')
    expect(result.theme.backgroundId).toBeTruthy()
    expect(result.theme.buttonId).toBeTruthy()
    expect(themesRepository.items).toHaveLength(1)
    expect(backgroundRepository.items).toHaveLength(1)
    expect(buttonRepository.items).toHaveLength(1)
  })

  it('should be able to update theme with only background', async () => {
    const userId = 'user-123'
    const page = Page.create(
      {
        ownerId: new UniqueEntityID(userId),
        slug: 'test-page',
      },
      new UniqueEntityID('page-123')
    )

    await pagesRepository.create(page)

    const themeData = {
      key: 'minimal',
      background: {
        type: 'color',
        color: '#ffffff',
      },
    }

    await sut.execute({
      pageId: 'page-123',
      ownerId: userId,
      themeData,
    })

    expect(backgroundRepository.items).toHaveLength(1)
    expect(buttonRepository.items).toHaveLength(0)

    const bg = backgroundRepository.items[0]
    expect(bg.type).toBe('color')
    expect(bg.color).toBe('#ffffff')
  })

  it('should be able to update theme with only button style', async () => {
    const userId = 'user-123'
    const page = Page.create(
      {
        ownerId: new UniqueEntityID(userId),
        slug: 'test-page',
      },
      new UniqueEntityID('page-123')
    )

    await pagesRepository.create(page)

    const themeData = {
      key: 'buttons-only',
      button: {
        style: 'outline',
        color: '#000000',
        textColor: '#000000',
      },
    }

    await sut.execute({
      pageId: 'page-123',
      ownerId: userId,
      themeData,
    })

    expect(backgroundRepository.items).toHaveLength(0)
    expect(buttonRepository.items).toHaveLength(1)

    const btn = buttonRepository.items[0]
    expect(btn.style).toBe('outline')
    expect(btn.color).toBe('#000000')
  })

  it('should not be able to update theme for non-existent page', async () => {
    const themeData = {
      key: 'test',
      background: {
        type: 'color',
        color: '#fff',
      },
    }

    await expect(() =>
      sut.execute({
        pageId: 'non-existent-page',
        ownerId: 'user-123',
        themeData,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should create theme even without background or button data', async () => {
    const userId = 'user-123'
    const page = Page.create(
      {
        ownerId: new UniqueEntityID(userId),
        slug: 'test-page',
      },
      new UniqueEntityID('page-123')
    )

    await pagesRepository.create(page)

    const themeData = {
      key: 'minimal-theme',
    }

    const result = await sut.execute({
      pageId: 'page-123',
      ownerId: userId,
      themeData,
    })

    expect(result.success).toBe(true)
    expect(themesRepository.items).toHaveLength(1)
    expect(backgroundRepository.items).toHaveLength(0)
    expect(buttonRepository.items).toHaveLength(0)

    const theme = themesRepository.items[0]
    expect(theme.backgroundId).toBeNull()
    expect(theme.buttonId).toBeNull()
  })
})
