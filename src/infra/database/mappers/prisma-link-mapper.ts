import { Link as PrismaLink, Prisma } from '@prisma/client'
import { Link } from 'src/domain/enterprise/entities/link.entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaLinkMapper {
  static toDomain(raw: PrismaLink): Link {
    return Link.create(
      {
        pageId: new UniqueEntityID(raw.pageId),
        url: raw.url,
        order: raw.order,
        title: raw.title,
        thumbnailUrl: raw.thumbnailUrl,
        clickCount: raw.clickCount,
        highlightEffect: raw.highlightEffect,
        scheduledStart: raw.scheduledStart,
        scheduledEnd: raw.scheduledEnd,
        type: raw.type,
        isLocked: raw.isLocked,
        active: raw.active,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(link: Link): Prisma.LinkUncheckedCreateInput {
    return {
      id: link.id.toString(),
      pageId: link.pageId.toString(),
      url: link.url,
      order: link.order,
      title: link.title ?? null,
      thumbnailUrl: link.thumbnailUrl ?? null,
      clickCount: link.clickCount,
      highlightEffect: link.highlightEffect ?? null,
      scheduledStart: link.scheduledStart ?? null,
      scheduledEnd: link.scheduledEnd ?? null,
      type: link.type,
      isLocked: link.isLocked,
      active: link.active,
      created_at: link.created_at,
      updated_at: link.updated_at ?? new Date(),
    }
  }

  static toDomainList(raw: PrismaLink[]): Link[] {
    return raw.map(l => this.toDomain(l))
  }
}
