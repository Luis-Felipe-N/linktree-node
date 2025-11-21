import type { Button } from '@/domain/enterprise/entities/button.entity'
import { ButtonRepository } from '../button-repository'

export class InMemoryButtonRepository implements ButtonRepository {
  public items: Button[] = []

  async create(data: Button) {
    this.items.push(data)

    return data
  }

  async save(button: Button) {
    const index = this.items.findIndex((item) => item.id.toString() === button.id.toString())

    if (index >= 0) {
      this.items[index] = button
    } else {
      this.items.push(button)
    }

    return button
  }

  async findById(id: string) {
    const button = this.items.find((item) => item.id.toString() === id)

    return button ?? null
  }
}
