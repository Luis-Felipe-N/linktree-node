import { Page as PrismaPage, Prisma, User, Theme, Link, Background, Button } from '@prisma/client'
import { Page } from '@/domain/enterprise/entities/page.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PageWithDetails = PrismaPage & {
  owner?: User | null
  theme?: (Theme & {
    background?: Background | null
    button?: Button | null
  }) | null
  links?: Link[]
}

export interface PageDetails {
  page: Page
  owner?: {
    id: string
    username: string
    email: string
  }
  theme?: {
    id: string
    title: string
    key?: string | null
    editable?: boolean | null
    luminance?: string | null
    typeface?: any
    socialStyle?: any
    heading?: any
    footer?: any
    background?: {
      id: string
      type: string
      gradientStart?: string | null
      gradientEnd?: string | null
      gradientDirection?: string | null
      imageUrl?: string | null
      videoUrl?: string | null
      style?: string | null
      className?: string | null
      properties?: any
      noise?: boolean | null
    }
    button?: {
      id: string
      style: string
      className?: string | null
      properties?: any
    }
  }
  links?: Array<{
    id: string
    url: string
    order: number
    title?: string | null
    thumbnailUrl?: string | null
    clickCount: number
    highlightEffect?: string | null
    scheduledStart?: Date | null
    scheduledEnd?: Date | null
    type: string
    isLocked: boolean
    active: boolean
  }>
}

export class PrismaPageMapper {
  static toDomain(raw: PrismaPage): Page {
    return Page.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        slug: raw.slug,
        title: raw.title,
        description: raw.description,
        imageUrl: raw.imageUrl,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(page: Page): Prisma.PageUncheckedCreateInput {
    return {
      id: page.id.toString(),
      ownerId: page.ownerId.toString(),
      slug: page.slug,
      title: page.title ?? null,
      description: page.description ?? null,
      imageUrl: page.imageUrl ?? null,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt ?? new Date(),
    }
  }

  static toDomainList(raw: PrismaPage[]): Page[] {
    return raw.map(page => this.toDomain(page))
  }

  static toDetails(raw: PageWithDetails): PageDetails {
    const page = this.toDomain(raw)

    const details: PageDetails = {
      page,
    }

    if (raw.owner) {
      details.owner = {
        id: raw.owner.id,
        username: raw.owner.username,
        email: raw.owner.email,
      }
    }

    if (raw.theme) {
      details.theme = {
        id: raw.theme.id,
        title: raw.theme.title,
        key: raw.theme.key,
        editable: raw.theme.editable,
        luminance: raw.theme.luminance,
        typeface: raw.theme.typeface,
        socialStyle: raw.theme.socialStyle,
        heading: raw.theme.heading,
        footer: raw.theme.footer,
      }

      if (raw.theme.background) {
        details.theme.background = {
          id: raw.theme.background.id,
          type: raw.theme.background.type,
          gradientStart: raw.theme.background.gradientStart,
          gradientEnd: raw.theme.background.gradientEnd,
          gradientDirection: raw.theme.background.gradientDirection,
          imageUrl: raw.theme.background.imageUrl,
          videoUrl: raw.theme.background.videoUrl,
          style: raw.theme.background.style,
          className: raw.theme.background.className,
          properties: raw.theme.background.properties,
          noise: raw.theme.background.noise,
        }
      }

      if (raw.theme.button) {
        details.theme.button = {
          id: raw.theme.button.id,
          style: raw.theme.button.style,
          className: raw.theme.button.className,
          properties: raw.theme.button.properties,
        }
      }
    }

    if (raw.links) {
      details.links = raw.links.map(link => ({
        id: link.id,
        url: link.url,
        order: link.order,
        title: link.title,
        thumbnailUrl: link.thumbnailUrl,
        clickCount: link.clickCount,
        highlightEffect: link.highlightEffect,
        scheduledStart: link.scheduledStart,
        scheduledEnd: link.scheduledEnd,
        type: link.type,
        isLocked: link.isLocked,
        active: link.active,
      }))
    }

    return details
  }

  static toDetailsList(raw: PageWithDetails[]): PageDetails[] {
    return raw.map(page => this.toDetails(page))
  }
}
