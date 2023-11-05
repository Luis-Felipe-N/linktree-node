import { Prisma, Theme } from '@prisma/client'

export interface ThemeRepository {
  create(data: Prisma.ThemeUncheckedCreateInput): Promise<Theme>
  save(theme: Theme): Promise<Theme>
}
