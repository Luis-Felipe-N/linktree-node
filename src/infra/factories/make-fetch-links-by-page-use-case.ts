import { PrismaLinksRepository } from 'src/infra/database/repositories/prisma-link-repository'
import { FetchLinksByPageUseCase } from 'src/domain/application/use-cases/links/fetch-links-by-page.usecase'

export function makeFetchLinksByPageUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const useCase = new FetchLinksByPageUseCase(linksRepository)

  return useCase
}