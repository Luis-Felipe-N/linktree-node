import { PrismaUsersRepository } from '../database/repositories/prisma-user-repository'
import { SearchUserUseCase } from '../../domain/application/use-cases/users/search-user.usecase'

export function makeSearchUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new SearchUserUseCase(usersRepository)

  return useCase
}
