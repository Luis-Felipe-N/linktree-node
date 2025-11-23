import { PrismaPagesRepository } from '../database/repositories/prisma-page-repository'
import { PrismaThemesRepository } from '../database/repositories/prisma-theme-repository'
import { PrismaBackgroundRepository } from '../database/repositories/prisma-background-repository'
import { PrismaButtonRepository } from '../database/repositories/prisma-button-repository'
import { UpdatePageThemeUseCase } from '../../domain/application/use-cases/themes/update-page-theme.usecase'

export function makeUpdatePageThemeUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const backgroundRepository = new PrismaBackgroundRepository()
  const buttonRepository = new PrismaButtonRepository()
  const themesRepository = new PrismaThemesRepository()

  return new UpdatePageThemeUseCase(
    pagesRepository,
    themesRepository,
    backgroundRepository,
    buttonRepository,
  )
}
