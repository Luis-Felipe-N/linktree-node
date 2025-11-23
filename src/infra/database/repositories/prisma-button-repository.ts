import { Button } from '../../../domain/enterprise/entities/button.entity'
import { prisma } from '../../../lib/prisma'
import { ButtonRepository } from '../../../repositories/button-repository'
import { PrismaButtonMapper } from '../mappers/prisma-button-mapper'

export class PrismaButtonRepository implements ButtonRepository {
  async create(button: Button) {
    const data = PrismaButtonMapper.toPrisma(button)
    const createdButton = await prisma.button.create({
      data
    })

    return PrismaButtonMapper.toDomain(createdButton)!
  }

  async save(button: Button) {
    const data = PrismaButtonMapper.toPrisma(button)

    const updatedButton = await prisma.button.update({
      where: { id: button.id.toString() },
      data
    })

    return PrismaButtonMapper.toDomain(updatedButton)!
  }

  async findById(id: string): Promise<Button | null> {
    const button = await prisma.button.findUnique({
      where: { id }
    })

    if (!button) {
      return null
    }

    return PrismaButtonMapper.toDomain(button)
  }
}
