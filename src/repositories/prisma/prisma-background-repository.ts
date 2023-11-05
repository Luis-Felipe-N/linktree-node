import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { BackgroundRepository } from '../background-repository'

export class PrismaBackgroundRepository implements BackgroundRepository {
  async create(data: Prisma.BackgroundCreateInput) {
    const background = await prisma.background.create({ data })

    return background
  }
}
