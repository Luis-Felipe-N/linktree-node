import { PrismaLinksRepository } from 'src/infra/database/repositories/prisma-link-repository'
import { PrismaPagesRepository } from 'src/infra/database/repositories/prisma-page-repository'
import { AddLinkToPageUseCase } from 'src/domain/application/use-cases/links/add-link-to-page.usecase'

export function makeAddLinkToPageUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new AddLinkToPageUseCase(linksRepository, pagesRepository)
  return useCase
}
