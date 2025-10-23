import type { Background } from '@/domain/enterprise/entities/background.entity'
import { prisma } from '../../lib/prisma'
import { BackgroundRepository } from '../background-repository'

export class InMemoryBackgroundRepository implements BackgroundRepository {
  public items: Background[] = []
  async create(data: Background) {
    this.items.push(data)
    return data
  }
}
