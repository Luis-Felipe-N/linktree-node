import { PrismaThemesRepository } from '@/repositories/prisma/prisma-theme-repository'
import { PrismaBackgroundRepository } from '@/repositories/prisma/prisma-background-repository'
import { PrismaButtonRepository } from '@/repositories/prisma/prisma-button-repository'

export function makeUpdatePageThemeUseCase() {
  const themesRepository = new PrismaThemesRepository()
  const pagesRepository = new PrismaPagesRepository()
  const backgroundRepository = new PrismaBackgroundRepository()
  const buttonRepository = new PrismaButtonRepository()
  const useCase = new UpdatePageThemeUseCase(
    themesRepository,
    pagesRepository,
    backgroundRepository,
    buttonRepository,
  )
  return useCase
}