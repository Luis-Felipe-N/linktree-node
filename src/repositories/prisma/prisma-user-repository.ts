import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import {
  FindByEmailOrUsernameParams,
  UsersRepository,
} from '../user-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  async findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParams) {
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithEmail) {
      return userWithEmail
    }

    const userWithUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    return userWithUsername
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
