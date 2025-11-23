import type { PagesRepository } from '../../../../repositories/page-repository'
import type { ThemeRepository } from '../../../../repositories/theme-repository'
import type { BackgroundRepository } from '../../../../repositories/background-repository'
import type { ButtonRepository } from '../../../../repositories/button-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Theme } from '../../../enterprise/entities/theme.entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { maketheme } from '../../factories/make-theme'
import { makeBackground } from '../../factories/make-background'
import { makeButton } from '../../factories/make-button'
import type { Background, BackgroundProps } from '../../../enterprise/entities/background.entity'
import type { Button, ButtonProps } from '../../../enterprise/entities/button.entity'

type BackgroundInput = Partial<BackgroundProps> | null | undefined
type buttonInput = (Partial<Omit<ButtonProps, 'text_color'>> & {
  textColor?: string | null
  text_color?: string | null
  properties?: Record<string, any> | null
}) | null | undefined

interface ThemeCustomizationPayload {
  background?: BackgroundInput
  button?: buttonInput
  active?: boolean
  [key: string]: unknown
}

interface UpdatePageThemeUseCaseRequest {
  pageId: string
  ownerId: string
  themeData: ThemeCustomizationPayload
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
    console.log("Found page:", themeData);
    if (!page || page.ownerId.toString() !== ownerId) {
      throw new ResourceNotFoundError()
    }

    const currentTheme = await this.themesRepository.findByPageId(pageId)

    const background = await this.upsertBackground(themeData.background, currentTheme?.background ?? null)
    const button = await this.upsertButton(themeData.button, currentTheme?.button ?? null)

    const theme = maketheme(
      {
        pageId: new UniqueEntityID(pageId),
        background,
        button,
        active: themeData.active ?? currentTheme?.active ?? true,
        created_at: currentTheme?.created_at,
      },
      currentTheme?.id,
    )

    const persistedTheme = currentTheme
      ? await this.themesRepository.save(theme)
      : await this.themesRepository.create(theme)

    return {
      theme: persistedTheme,
      success: true,
    }
  }

  private async upsertBackground(
    backgroundData: BackgroundInput,
    currentBackground: Background | null,
  ): Promise<Background | null> {
    if (backgroundData === null) {
      return null
    }

    if (backgroundData === undefined) {
      return currentBackground
    }

    const snapshot: Partial<BackgroundProps> = currentBackground
      ? {
        type: currentBackground.type,
        color: currentBackground.color ?? undefined,
        gradientStart: currentBackground.gradientStart ?? undefined,
        gradientEnd: currentBackground.gradientEnd ?? undefined,
        gradientDirection: currentBackground.gradientDirection ?? undefined,
        imageUrl: currentBackground.imageUrl ?? undefined,
        videoUrl: currentBackground.videoUrl ?? undefined,
        style: currentBackground.style ?? undefined,
        properties: currentBackground.properties ?? undefined,
        active: currentBackground.active,
        created_at: currentBackground.created_at,
      }
      : {}

    const payload: Partial<BackgroundProps> = {
      ...snapshot,
      ...backgroundData,
      type: backgroundData?.type ?? snapshot.type ?? 'color',
      active: backgroundData?.active ?? snapshot.active ?? true,
      created_at: snapshot.created_at,
    }

    const background = makeBackground(payload, currentBackground?.id)

    if (currentBackground) {
      return await this.backgroundRepository.save(background)
    }

    return await this.backgroundRepository.create(background)
  }

  private async upsertButton(
    buttonData: buttonInput,
    currentButton: Button | null,
  ): Promise<Button | null> {
    console.log("Upserting button with data:", buttonData, "and current button:", currentButton);
    if (buttonData === null) {
      return null
    }

    if (buttonData === undefined) {
      return currentButton
    }

    const snapshot: Partial<ButtonProps> = currentButton
      ? {
        style: currentButton.style,
        properties: currentButton.properties ?? undefined,
        active: currentButton.active,
        created_at: currentButton.created_at,
      }
      : {}

    const payload: Partial<ButtonProps> = {
      ...snapshot,
      style: buttonData?.style ?? snapshot.style ?? 'filled',
      properties: buttonData?.properties ?? snapshot.properties ?? null,
      active: buttonData?.active ?? snapshot.active ?? true,
      created_at: snapshot.created_at,
    }

    const button = makeButton(payload, currentButton?.id)

    if (currentButton) {
      return await this.buttonRepository.save(button)
    }

    return await this.buttonRepository.create(button)
  }
}
