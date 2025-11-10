import { PrismaLinksRepository } from '@/repositories/prisma/prisma-link-repository'
import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository'
import { AddLinkToPageUseCase } from '../add-link-to-page.usecase'

export function makeAddLinkToPageUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const pagesRepository = new PrismaPagesRepository()
  const useCase = new AddLinkToPageUseCase(linksRepository, pagesRepository)
  return useCase
}
