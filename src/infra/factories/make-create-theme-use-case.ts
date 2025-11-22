import { PrismaThemesRepository } from 'src/infra/database/repositories/prisma-theme-repository'
import { CreateThemeUseCase } from 'src/domain/application/use-cases/themes/create-theme.usecase'

export function makeCreateThemeUseCase() {
  const themesRepository = new PrismaThemesRepository()
  const useCase = new CreateThemeUseCase(themesRepository)

  return useCase
}
