import type { Button } from '@/domain/enterprise/entities/button.entity'
import { ButtonRepository } from '../button-repository'

export class InMemoryButtonRepository implements ButtonRepository {
  public items: Button[] = []

  async create(data: Button) {
    this.items.push(data)

    return data
  }
}
