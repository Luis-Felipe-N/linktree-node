import { PrismaPagesRepository } from "@/repositories/prisma/prisma-page-repository"


export function makeGetPageDetailsUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new GetPageDetailsUseCase(pagesRepository)
  return useCase
}