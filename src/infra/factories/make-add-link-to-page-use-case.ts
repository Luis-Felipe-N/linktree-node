import { PrismaLinksRepository } from '../database/repositories/prisma-link-repository'
import { PrismaPagesRepository } from '../database/repositories/prisma-page-repository'
import { AddLinkToPageUseCase } from '../../domain/application/use-cases/links/add-link-to-page.usecase'

export function makeAddLinkToPageUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new AddLinkToPageUseCase(linksRepository, pagesRepository)
  return useCase
}
