import { PrismaUsersRepository } from 'src/infra/database/repositories/prisma-user-repository'
import { ProfileUseCase } from 'src/domain/application/use-cases/users/get-profile.usecase'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ProfileUseCase(usersRepository)

  return useCase
}
