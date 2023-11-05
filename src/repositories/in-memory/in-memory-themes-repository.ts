import { Prisma, Theme } from '@prisma/client'
import { ThemeRepository } from '../theme-repository'
import { randomUUID } from 'crypto'

export class InMemoryThemesRepository implements ThemeRepository {
  public items: Theme[] = []

  async create(data: Prisma.ThemeUncheckedCreateInput) {
    const theme = {
      id: randomUUID(),
      active: true,
      created_at: new Date(),
      title: data.title,
      button_id: data.button_id || null,
      background_id: data.background_id || null,
      user_id: data.user_id,
    }

    this.items.push(theme)

    return theme
  }

  async save(theme: Theme) {
    const themeIndex = this.items.findIndex((item) => item.id === theme.id)

    if (themeIndex >= 0) {
      this.items[themeIndex] = theme
    }

    return theme
  }
}
