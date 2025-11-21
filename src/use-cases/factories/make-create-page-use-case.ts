import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'
import { CreatePageUseCase } from '../pages/create-page.usecase'

export function makeCreatePageUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreatePageUseCase(pagesRepository, usersRepository)
  return useCase
}