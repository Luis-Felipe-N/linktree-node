import { PrismaLinksRepository } from '@/repositories/prisma/prisma-link-repository'
import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository'
import { UpdateLinkUseCase } from '../update-link.usecase'

export function makeUpdateLinkUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const pagesRepository = new PrismaPagesRepository()
  const updateLinkUseCase = new UpdateLinkUseCase(linksRepository, pagesRepository)

  return updateLinkUseCase
}
