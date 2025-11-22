import { PrismaPagesRepository } from 'src/infra/database/repositories/prisma-page-repository'
import { GetPageDetailsUseCase } from 'src/domain/application/use-cases/pages/get-page-details.usecase'

export function makeGetPageDetailsUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new GetPageDetailsUseCase(pagesRepository)
  return useCase
}