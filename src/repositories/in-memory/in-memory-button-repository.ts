import { Button, Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { ButtonRepository } from '../button-repository'
import { randomUUID } from 'crypto'

export class PrismaButtonRepository implements ButtonRepository {
  public items: Button[] = []

  async create(data: Prisma.ButtonUncheckedCreateInput) {
    const button = {
      id: randomUUID(),
      active: true,
      created_at: new Date(),
      color: '#fff',
      style: 'border: 1px solid back',
      text_color: '#000',
      theme: null,
    }

    this.items.push(button)

    return button
  }
}
