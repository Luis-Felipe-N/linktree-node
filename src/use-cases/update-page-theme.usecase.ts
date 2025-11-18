import type { PagesRepository } from '@/repositories/page-repository'
import type { ThemeRepository } from '@/repositories/theme-repository'
import type { BackgroundRepository } from '@/repositories/background-repository'
import type { ButtonRepository } from '@/repositories/button-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Background } from '@/domain/enterprise/entities/background.entity'
import { Button } from '@/domain/enterprise/entities/button.entity'
import { Theme } from '@/domain/enterprise/entities/theme.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface UpdatePageThemeUseCaseRequest {
  pageId: string
  ownerId: string
  themeData: Record<string, any>
}

interface UpdatePageThemeUseCaseResponse {
  theme: Theme
  success: boolean
}

export class UpdatePageThemeUseCase {
  constructor(
    private pagesRepository: PagesRepository,
    private themesRepository: ThemeRepository,
    private backgroundRepository: BackgroundRepository,
    private buttonRepository: ButtonRepository,
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

    let backgroundId: UniqueEntityID | null = null
    let buttonId: UniqueEntityID | null = null

    if (themeData.background) {
      const bg = themeData.background
      const background = Background.create({
        type: bg.type || 'color',
        color: bg.color || null,
        gradientStart: bg.gradientStart || null,
        gradientEnd: bg.gradientEnd || null,
        gradientDirection: bg.gradientDirection || null,
        imageUrl: bg.imageUrl || null,
        videoUrl: bg.videoUrl || null,
        style: bg.style || null,
      })
      const createdBackground = await this.backgroundRepository.create(background)
      backgroundId = createdBackground.id
    }

    if (themeData.buttonStyle) {
      const btn = themeData.buttonStyle
      const button = Button.create({
        style: btn.style || 'filled',
        color: btn.color || '#000000',
        text_color: btn.textColor || '#FFFFFF',
        fontFamily: btn.fontFamily || null,
        fontWeight: btn.fontWeight || null,
        shadowStyle: btn.shadowStyle || null,
        shadowColor: btn.shadowColor || null,
      })
      const createdButton = await this.buttonRepository.create(button)
      buttonId = createdButton.id
    }

    const theme = Theme.create({
      pageId: new UniqueEntityID(pageId),
      title: themeData.key || 'Custom Theme',
      backgroundId,
      buttonId,
    })

    const createdTheme = await this.themesRepository.create(theme)

    return {
      theme: createdTheme,
      success: true,
    }
  }
}
