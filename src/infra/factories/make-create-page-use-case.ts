import { PrismaPagesRepository } from '../database/repositories/prisma-page-repository'
import { PrismaUsersRepository } from '../database/repositories/prisma-user-repository'
import { CreatePageUseCase } from '../../domain/application/use-cases/pages/create-page.usecase'

export function makeCreatePageUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreatePageUseCase(pagesRepository, usersRepository)
  return useCase
}