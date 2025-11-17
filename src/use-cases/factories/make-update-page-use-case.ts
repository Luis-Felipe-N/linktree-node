import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository'
import { UpdatePageUseCase } from '../update-page.usecase'

export function makeUpdatePageUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const updatePageUseCase = new UpdatePageUseCase(pagesRepository)

  return updatePageUseCase
}
