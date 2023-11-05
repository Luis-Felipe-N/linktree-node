import { hash } from 'bcrypt'
import { UsersRepository } from '../repositories/user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { Theme, User } from '@prisma/client'
import { ThemeRepository } from '@/repositories/theme-repository'

interface CreateThemeUserRequest {
  title: string
  userId: string
  buttonId: string | null
  backgroundId: string | null
}

interface CreateThemeUserResponse {
  theme: Theme
}

export class CreateThemeUseCase {
  constructor(private themeRepository: ThemeRepository) {}

  async execute({
    title,
    userId,
    backgroundId,
    buttonId,
  }: CreateThemeUserRequest): Promise<CreateThemeUserResponse> {
    // Request datas in usecase and make the logic to CreateTheme user
    const theme = await this.themeRepository.create({
      title,
      user_id: userId,
      background_id: backgroundId,
      button_id: buttonId,
    })

    return {
      theme,
    }
  }
}
