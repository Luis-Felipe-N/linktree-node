import { PrismaUsersRepository } from "../../repositories/prisma/prisma-user-repository";
import { RegisterUseCase } from "../register.usecase";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RegisterUseCase(usersRepository)

  return useCase
}