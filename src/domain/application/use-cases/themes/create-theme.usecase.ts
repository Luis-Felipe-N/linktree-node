import { hash } from 'bcrypt'
import { UsersRepository } from '../../../../repositories/user-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

import { ThemeRepository } from 'src/repositories/theme-repository'
import { Theme } from 'src/domain/enterprise/entities/theme.entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

interface CreateThemeUserRequest {
  title: string
  pageId: string
  buttonId: string | null
  backgroundId: string | null
}

interface CreateThemeUserResponse {
  theme: Theme
}

export class CreateThemeUseCase {
  constructor(private themeRepository: ThemeRepository) { }

  async execute({
    title,
    pageId,
    backgroundId,
    buttonId,
  }: CreateThemeUserRequest): Promise<CreateThemeUserResponse> {
    const theme = Theme.create({
      title,
      backgroundId: backgroundId ? new UniqueEntityID(backgroundId) : null,
      buttonId: buttonId ? new UniqueEntityID(buttonId) : null,
      pageId: new UniqueEntityID(pageId),
    })

    await this.themeRepository.create(theme)

    return {
      theme,
    }
  }
}
