import { Page as PrismaPage, Prisma } from '@prisma/client'
import { Page } from '@/domain/enterprise/entities/page.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaPageMapper {
  /**
   * Converte do modelo Prisma para a entidade de domínio
   */
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

  /**
   * Converte da entidade de domínio para o modelo Prisma (para criação)
   */
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

  /**
   * Converte múltiplos registros Prisma para entidades de domínio
   */
  static toDomainList(raw: PrismaPage[]): Page[] {
    return raw.map(page => this.toDomain(page))
  }
}
