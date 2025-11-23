import { PrismaPagesRepository } from '../database/repositories/prisma-page-repository'
import { GetUserPagesUseCase } from '../../domain/application/use-cases/pages/get-user-pages.usecase'

export function makeGetUserPagesUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new GetUserPagesUseCase(pagesRepository)
  return useCase
}
