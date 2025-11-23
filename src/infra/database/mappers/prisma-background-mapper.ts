import { UniqueEntityID } from '../../../core/entities/unique-entity-id'
import { Background } from '../../../domain/enterprise/entities/background.entity'
import { Prisma, Background as PrismaBackground } from '@prisma/client'

export class PrismaBackgroundMapper {
  static toDomain(raw: PrismaBackground): Background {
    const properties = (raw.properties as Record<string, any>) || {}

    return Background.create(
      {
        type: raw.type as any,
        color: properties.backgroundColor || null,
        gradientStart: raw.gradientStart,
        gradientEnd: raw.gradientEnd,
        gradientDirection: raw.gradientDirection,
        imageUrl: raw.imageUrl,
        videoUrl: raw.videoUrl,
        style: raw.style,
        properties,
        active: raw.active,
        created_at: raw.created_at,
      },
      new UniqueEntityID(raw.id),
    )
  }
  static toPrisma(background: Background): Prisma.BackgroundUncheckedCreateInput {
    const properties: Record<string, any> = {
      ...(background.properties ?? {}),
    }

    if (background.color) {
      properties.backgroundColor = background.color
    }
    return {
      id: background.id.toString(),
      type: background.type,
      gradientStart: background.gradientStart,
      gradientEnd: background.gradientEnd,
      gradientDirection: background.gradientDirection,
      imageUrl: background.imageUrl,
      videoUrl: background.videoUrl,
      style: background.style,
      properties: Object.keys(properties).length > 0 ? properties : Prisma.JsonNull,
      active: background.active,
      created_at: background.created_at,
    }
  }
}
