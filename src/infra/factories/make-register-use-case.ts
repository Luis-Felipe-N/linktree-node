import { PrismaUsersRepository } from '../database/repositories/prisma-user-repository'
import { RegisterUseCase } from '../../domain/application/use-cases/users/register.usecase'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RegisterUseCase(usersRepository)

  return useCase
}
