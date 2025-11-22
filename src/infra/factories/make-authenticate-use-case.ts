import { PrismaUsersRepository } from 'src/infra/database/repositories/prisma-user-repository'
import { AuthenticateUseCase } from 'src/domain/application/use-cases/users/authenticate.usecase'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(usersRepository)

  return useCase
}
