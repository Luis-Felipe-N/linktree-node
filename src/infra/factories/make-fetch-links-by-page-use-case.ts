import { PrismaLinksRepository } from '../database/repositories/prisma-link-repository'
import { FetchLinksByPageUseCase } from '../../domain/application/use-cases/links/fetch-links-by-page.usecase'

export function makeFetchLinksByPageUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const useCase = new FetchLinksByPageUseCase(linksRepository)

  return useCase
}