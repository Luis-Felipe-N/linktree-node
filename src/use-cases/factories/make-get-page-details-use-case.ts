import { PrismaPagesRepository } from "@/repositories/prisma/prisma-page-repository"
import { GetPageDetailsUseCase } from "../get-page-details.usecase"

export function makeGetPageDetailsUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new GetPageDetailsUseCase(pagesRepository)
  return useCase
}