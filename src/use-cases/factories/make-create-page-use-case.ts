import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeCreatePageUseCase() {
  const pagesRepository = new PrismaPagesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreatePageUseCase(pagesRepository, usersRepository)
  return useCase
}