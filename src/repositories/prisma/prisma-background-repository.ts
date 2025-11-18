import { Background } from '@/domain/enterprise/entities/background.entity'
import { prisma } from '../../lib/prisma'
import { BackgroundRepository } from '../background-repository'

export class PrismaBackgroundRepository implements BackgroundRepository {
  async create(background: Background) {
    const properties: Record<string, any> = {}

    if (background.color) {
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
}
