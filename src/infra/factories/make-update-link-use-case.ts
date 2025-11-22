import { PrismaLinksRepository } from 'src/infra/database/repositories/prisma-link-repository'
import { PrismaPagesRepository } from 'src/infra/database/repositories/prisma-page-repository'
import { UpdateLinkUseCase } from 'src/domain/application/use-cases/links/update-link.usecase'

export function makeUpdateLinkUseCase() {
  const linksRepository = new PrismaLinksRepository()
  const pagesRepository = new PrismaPagesRepository()
  const updateLinkUseCase = new UpdateLinkUseCase(linksRepository, pagesRepository)

  return updateLinkUseCase
}
