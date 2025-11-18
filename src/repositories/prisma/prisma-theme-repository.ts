import { Theme } from '@/domain/enterprise/entities/theme.entity'
import { prisma } from '../../lib/prisma'
import { ThemeRepository } from '../theme-repository'

export class PrismaThemesRepository implements ThemeRepository {
  async create(theme: Theme) {
    await prisma.theme.create({
      data: {
        id: theme.id.toString(),
        title: theme.title,
        pageId: theme.pageId.toString(),
        backgroundId: theme.backgroundId?.toString(),
        buttonId: theme.buttonId?.toString(),
        active: theme.active,
        created_at: theme.created_at,
      }
    })

    return theme
  }

  async save(theme: Theme) {
    await prisma.theme.update({
      where: {
        id: theme.id.toString(),
      },
      data: {
        title: theme.title,
        backgroundId: theme.backgroundId?.toString(),
        buttonId: theme.buttonId?.toString(),
        active: theme.active,
      },
    })

    return theme
  }
}
