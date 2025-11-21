import type { PagesRepository } from '@/repositories/page-repository'
import type { ThemeRepository } from '@/repositories/theme-repository'
import type { BackgroundRepository } from '@/repositories/background-repository'
import type { ButtonRepository } from '@/repositories/button-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Theme } from '@/domain/enterprise/entities/theme.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { maketheme } from '../makers/make-theme'

interface UpdatePageThemeUseCaseRequest {
  pageId: string
  ownerId: string
  themeData: Theme
}

interface UpdatePageThemeUseCaseResponse {
  theme: Theme
}

export class UpdatePageThemeUseCase {
  constructor(
    private pagesRepository: PagesRepository,
    private themesRepository: ThemeRepository,
  ) { }

  async execute({
    pageId,
    ownerId,
    themeData,
  }: UpdatePageThemeUseCaseRequest): Promise<UpdatePageThemeUseCaseResponse> {
    const page = await this.pagesRepository.findById(pageId)

    if (!page) {
      throw new ResourceNotFoundError()
    }

    const theme = maketheme({
      ...themeData,
      pageId: new UniqueEntityID(pageId)
    })

    const themeExists = await this.themesRepository.findByPageId(pageId)

    if (themeExists) {
      const themeCreated = await this.themesRepository.save(theme)
      return {
        theme: themeCreated,
      }
    } else {
      const themeCreated = await this.themesRepository.create(theme)

      return {
        theme: themeCreated,
      }
    }
  }
}
