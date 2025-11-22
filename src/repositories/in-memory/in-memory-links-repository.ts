import { Link } from 'src/domain/enterprise/entities/link.entity'
import type { LinksRepository } from '../link-repository'

export class InMemoryLinksRepository implements LinksRepository {
  public items: Link[] = []

  async create(data: Link): Promise<Link> {
    this.items.push(data)
    return data
  }

  async findById(id: string): Promise<Link | null> {
    const link = this.items.find((item) => item.id.toString() === id)
    return link ?? null
  }

  async findByPageId(pageId: string): Promise<Link[]> {
    const links = this.items
      .filter((item) => item.pageId.toString() === pageId)
      .sort((a, b) => a.order - b.order)

    return links
  }

  async update(link: Link): Promise<Link> {
    const index = this.items.findIndex((item) => item.id.toString() === link.id.toString())

    if (index >= 0) {
      this.items[index] = link
    }

    return link
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async reorderLinks(pageId: string, linkIds: string[]): Promise<void> {
    linkIds.forEach((linkId, index) => {
      const link = this.items.find(
        (item) => item.id.toString() === linkId && item.pageId.toString() === pageId
      )

      if (link) {
        link.order = index
      }
    })
  }
}
