import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository'
import { GetUserPagesUseCase } from '../pages/get-user-pages.usecase'

export function makeGetUserPagesUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new GetUserPagesUseCase(pagesRepository)
  return useCase
}
