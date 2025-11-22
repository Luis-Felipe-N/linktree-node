import type { Theme } from 'src/domain/enterprise/entities/theme.entity'
import { ThemeRepository } from '../theme-repository'
import { randomUUID } from 'crypto'

export class InMemoryThemesRepository implements ThemeRepository {
  public items: Theme[] = []

  async create(data: Theme) {
    this.items.push(data)

    return data
  }

  async save(theme: Theme) {
    const themeIndex = this.items.findIndex((item) => item.id.toString() === theme.id.toString())

    if (themeIndex >= 0) {
      this.items[themeIndex] = theme
    }

    return theme
  }

  async findByPageId(pageId: string) {
    const theme = this.items.find((item) => item.pageId.toString() === pageId)

    return theme ?? null
  }
}
