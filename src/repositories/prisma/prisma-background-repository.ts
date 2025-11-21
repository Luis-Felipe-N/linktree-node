import { Background } from '@/domain/enterprise/entities/background.entity'
import { prisma } from '../../lib/prisma'
import { BackgroundRepository } from '../background-repository'
import { PrismaBackgroundMapper } from './mappers/prisma-background-mapper'

export class PrismaBackgroundRepository implements BackgroundRepository {
  async create(background: Background) {
    const properties: Record<string, any> = background.properties || {}

    if (background.color && !properties.backgroundColor) {
      properties.backgroundColor = background.color
    }

    await prisma.background.create({
      data: {
        id: background.id.toString(),
        type: background.type.toUpperCase(),
        gradientStart: background.gradientStart,
        gradientEnd: background.gradientEnd,
        gradientDirection: background.gradientDirection,
        imageUrl: background.imageUrl,
        videoUrl: background.videoUrl,
        style: background.style,
        properties: Object.keys(properties).length > 0 ? properties : undefined,
        active: background.active,
        created_at: background.created_at,
      }
    })

    return background
  }

  async save(background: Background): Promise<Background> {
    const data = PrismaBackgroundMapper.toPrisma(background)

    const backgroundUptaded = await prisma.background.update({
      where: { id: background.id.toString() },
      data
    })

    return PrismaBackgroundMapper.toDomain(backgroundUptaded)
  }
  async findById(id: string): Promise<Background | null> {
    const background = await prisma.background.findUnique({
      where: { id }
    })

    if (!background) {
      return null
    }

    return PrismaBackgroundMapper.toDomain(background)
  }
}
