import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import {
  FindByEmailOrUsernameParams,
  UsersRepository,
} from '../user-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
    })

    return user
  }

  async findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParams) {
    if (email) {
      const userWithEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithEmail) {
        return userWithEmail
      }
    }

    if (username) {
      const userWithUsername = await prisma.user.findUnique({
        where: {
          username,
        },
      })

      return userWithUsername
    }

    return null
  }

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
