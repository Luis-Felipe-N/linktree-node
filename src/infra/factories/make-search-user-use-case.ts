import { PrismaUsersRepository } from 'src/infra/database/repositories/prisma-user-repository'
import { SearchUserUseCase } from 'src/domain/application/use-cases/users/search-user.usecase'

export function makeSearchUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new SearchUserUseCase(usersRepository)

  return useCase
}
