import { PrismaThemesRepository } from '@/repositories/prisma/prisma-theme-repository'
import { CreateThemeUseCase } from '../themes/create-theme.usecase'

export function makeCreateThemeUseCase() {
  const themesRepository = new PrismaThemesRepository()
  const useCase = new CreateThemeUseCase(themesRepository)

  return useCase
}
