import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { SearchUserUseCase } from '../search-user.usecase'

export function makeSearchUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new SearchUserUseCase(usersRepository)

  return useCase
}
