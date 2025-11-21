import { Page as PrismaPage, Prisma, User, Theme, Link, Background, Button } from '@prisma/client'
import { Page } from '@/domain/enterprise/entities/page.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaUserMapper } from './prisma-user-mapper'
import { PrismaThemeMapper } from './prisma-theme-mapper'
import { LinkList } from '@/domain/enterprise/entities/link.entity'
import { PrismaLinkMapper } from './prisma-link-mapper'

type ThemeWithDetails = Theme & {
  background: Background | null
  button: Button | null
}

type PageWithDetails = PrismaPage & {
  owner: User
  theme: ThemeWithDetails | null
  links: Link[]
}


export class PrismaPageMapper {
  static toDomain(raw: PageWithDetails): Page {
    return Page.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        slug: raw.slug,
        title: raw.title,
        description: raw.description,
        imageUrl: raw.imageUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
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

  static toDetails(raw: PageWithDetails): Page {
    return Page.create({
      ownerId: new UniqueEntityID(raw.ownerId),
      title: raw.title,
      slug: raw.slug,
      description: raw.description ?? null,
      imageUrl: raw.imageUrl ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      owner: PrismaUserMapper.toDomain(raw.owner),
      theme: raw.theme ? PrismaThemeMapper.toDomain(raw.theme) : undefined,
      links: new LinkList(raw.links.map(PrismaLinkMapper.toDomain))
    })
  }

  static toDetailsList(raw: PageWithDetails[]): Page[] {
    return raw.map(page => this.toDetails(page))
  }
}