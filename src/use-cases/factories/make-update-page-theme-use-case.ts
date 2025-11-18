import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository'
import { PrismaThemesRepository } from '@/repositories/prisma/prisma-theme-repository'
import { PrismaBackgroundRepository } from '@/repositories/prisma/prisma-background-repository'
import { PrismaButtonRepository } from '@/repositories/prisma/prisma-button-repository'
import { UpdatePageThemeUseCase } from '../update-page-theme.usecase'

export function makeUpdatePageThemeUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const themesRepository = new PrismaThemesRepository()
  const backgroundRepository = new PrismaBackgroundRepository()
  const buttonRepository = new PrismaButtonRepository()

  return new UpdatePageThemeUseCase(
    pagesRepository,
    themesRepository,
    backgroundRepository,
    buttonRepository,
  )
}
