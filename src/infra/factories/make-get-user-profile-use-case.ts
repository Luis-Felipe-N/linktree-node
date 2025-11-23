import { PrismaUsersRepository } from '../database/repositories/prisma-user-repository'
import { ProfileUseCase } from '../../domain/application/use-cases/users/get-profile.usecase'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ProfileUseCase(usersRepository)

  return useCase
}
