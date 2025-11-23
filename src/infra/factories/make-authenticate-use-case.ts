import { PrismaUsersRepository } from '../database/repositories/prisma-user-repository'
import { AuthenticateUseCase } from '../../domain/application/use-cases/users/authenticate.usecase'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(usersRepository)

  return useCase
}
