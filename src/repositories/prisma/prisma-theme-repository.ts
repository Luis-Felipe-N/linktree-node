import { Theme } from '@/domain/enterprise/entities/theme.entity'
import { prisma } from '../../lib/prisma'
import { ThemeRepository } from '../theme-repository'
import { PrismaThemeMapper } from './mappers/prisma-theme-mapper'
export class PrismaThemesRepository implements ThemeRepository {

  async create(theme: Theme) {
    const data = PrismaThemeMapper.toPrisma(theme)

    await prisma.theme.create({
      data
    })

    return theme
  }

  async save(theme: Theme) {
    const data = PrismaThemeMapper.toPrisma(theme)

    await prisma.theme.update({
      where: {
        id: theme.id.toString(),
      },
      data
    })

    return theme
  }

  async findByPageId(pageId: string): Promise<Theme | null> {
    const theme = await prisma.theme.findUnique({
      where: { pageId },
      include: {
        background: true,
        button: true,
      }
    })

    if (!theme) return null

    return PrismaThemeMapper.toDomain(theme)
  }
}