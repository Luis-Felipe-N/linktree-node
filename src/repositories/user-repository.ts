import { Prisma, User } from '@prisma/client'

export interface FindByEmailOrUsernameParams {
  email?: string
  username?: string
}

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParams): Promise<User | null>
}
