import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { ProfileUseCase } from '../users/get-profile.usecase'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ProfileUseCase(usersRepository)

  return useCase
}
