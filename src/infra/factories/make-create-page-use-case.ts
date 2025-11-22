import { PrismaPagesRepository } from 'src/infra/database/repositories/prisma-page-repository'
import { PrismaUsersRepository } from 'src/infra/database/repositories/prisma-user-repository'
import { CreatePageUseCase } from 'src/domain/application/use-cases/pages/create-page.usecase'

export function makeCreatePageUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreatePageUseCase(pagesRepository, usersRepository)
  return useCase
}