import type { Background } from 'src/domain/enterprise/entities/background.entity'
import { BackgroundRepository } from '../background-repository'

export class InMemoryBackgroundRepository implements BackgroundRepository {
  public items: Background[] = []
  async create(data: Background) {
    this.items.push(data)
    return data
  }

  async save(background: Background) {
    const index = this.items.findIndex((item) => item.id.toString() === background.id.toString())

    if (index >= 0) {
      this.items[index] = background
    } else {
      this.items.push(background)
    }

    return background
  }

  async findById(id: string) {
    const background = this.items.find((item) => item.id.toString() === id)

    return background ?? null
  }
}
