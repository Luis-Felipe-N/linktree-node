import { Page } from 'src/domain/enterprise/entities/page.entity'
import type { PagesRepository } from '../page-repository'

export class InMemoryPagesRepository implements PagesRepository {
  public items: Page[] = []

  async create(data: Page): Promise<Page> {
    this.items.push(data)
    return data
  }

  async findById(id: string): Promise<Page | null> {
    const page = this.items.find((item) => item.id.toString() === id)
    return page ?? null
  }

  async findBySlug(slug: string): Promise<Page | null> {
    const page = this.items.find((item) => item.slug === slug)
    return page ?? null
  }

  async findByOwnerId(ownerId: string): Promise<Page[]> {
    const pages = this.items
      .filter((item) => item.ownerId.toString() === ownerId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    return pages
  }

  async save(page: Page): Promise<Page> {
    const index = this.items.findIndex((item) => item.id.toString() === page.id.toString())

    if (index >= 0) {
      this.items[index] = page
    }

    return page
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}
