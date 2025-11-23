import { PrismaPagesRepository } from '../database/repositories/prisma-page-repository'
import { UpdatePageUseCase } from '../../domain/application/use-cases/pages/update-page.usecase'

export function makeUpdatePageUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const updatePageUseCase = new UpdatePageUseCase(pagesRepository)

  return updatePageUseCase
}
