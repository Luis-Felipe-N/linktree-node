import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { ButtonRepository } from '../button-repository'

export class PrismaButtonRepository implements ButtonRepository {
  async create(data: Prisma.ButtonCreateInput) {
    const button = await prisma.button.create({ data })

    return button
  }
}
