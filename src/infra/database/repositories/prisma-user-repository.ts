import { Prisma } from '@prisma/client'
import { prisma } from '../../../lib/prisma'
import {
  FindByEmailOrUsernameParams,
  UsersRepository,
} from '../../../repositories/user-repository'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { User } from '../../../domain/enterprise/entities/user.entity'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParams): Promise<User | null> {
    if (email) {
      const userWithEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithEmail) {
        return PrismaUserMapper.toDomain(userWithEmail)
      }
    }

    if (username) {
      const userWithUsername = await prisma.user.findUnique({
        where: {
          username,
        },
      })

      if (userWithUsername) {
        return PrismaUserMapper.toDomain(userWithUsername)
      }
    }

    return null
  }

  async create(data: User): Promise<User> {
    const prismaData = PrismaUserMapper.toPrisma(data)
    const created = await prisma.user.create({ data: prismaData })

    return PrismaUserMapper.toDomain(created)
  }
}
