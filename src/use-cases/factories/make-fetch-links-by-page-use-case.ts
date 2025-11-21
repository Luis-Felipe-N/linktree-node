import { PrismaLinksRepository } from "@/repositories/prisma/prisma-link-repository"
import { FetchLinksByPageUseCase } from "../links/fetch-links-by-page.usecase"

export function makeFetchLinksByPageUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const useCase = new FetchLinksByPageUseCase(linksRepository)

  return useCase
}