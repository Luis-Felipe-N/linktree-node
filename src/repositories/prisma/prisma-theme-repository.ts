import { Prisma, Theme } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { ThemeRepository } from '../theme-repository'

export class PrismaThemesRepository implements ThemeRepository {
  async create(data: Prisma.ThemeUncheckedCreateInput) {
    const theme = await prisma.theme.create({ data })

    return theme
  }

  async save(theme: Theme) {
    const createdTheme = prisma.theme.update({
      where: {
        id: theme.id,
      },
      data: theme,
    })

    return createdTheme
  }
}
