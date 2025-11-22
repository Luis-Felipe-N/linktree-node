import { beforeEach, describe, expect, it } from 'vitest'

import { CreateThemeUseCase } from './create-theme.usecase'
import { InMemoryThemesRepository } from 'src/repositories/in-memory/in-memory-themes-repository'

let themeRepository: InMemoryThemesRepository
let sut: CreateThemeUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    themeRepository = new InMemoryThemesRepository()
    sut = new CreateThemeUseCase(themeRepository)
  })

  it('should be able to create gym', async () => {
    const { theme } = await sut.execute({
      title: 'Tema do Shrek',
      pageId: 'adryeli',
      backgroundId: null,
      buttonId: null,
    })

    expect(theme.id.toString()).toEqual(expect.any(String))
  })
})
