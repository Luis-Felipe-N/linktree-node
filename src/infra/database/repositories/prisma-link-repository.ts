import { prisma } from 'src/lib/prisma'
import { Link } from 'src/domain/enterprise/entities/link.entity'
import type { LinksRepository } from '../../../repositories/link-repository'
import { PrismaLinkMapper } from '../mappers/prisma-link-mapper'

export class PrismaLinksRepository implements LinksRepository {
  async create(data: Link): Promise<Link> {
    const prismaData = PrismaLinkMapper.toPrisma(data)
    const created = await prisma.link.create({ data: prismaData })
    return PrismaLinkMapper.toDomain(created)
  }

  async findById(id: string): Promise<Link | null> {
    const link = await prisma.link.findUnique({
      where: { id },
    })

    if (!link) return null

    return PrismaLinkMapper.toDomain(link)
  }

  async findByPageId(pageId: string): Promise<Link[]> {
    const links = await prisma.link.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    })

    return PrismaLinkMapper.toDomainList(links)
  }

  async update(link: Link): Promise<Link> {
    const prismaData = PrismaLinkMapper.toPrisma(link)
    const { id, ...dataToUpdate } = prismaData

    const updated = await prisma.link.update({
      where: { id },
      data: dataToUpdate,
    })

    return PrismaLinkMapper.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await prisma.link.delete({
      where: { id },
    })
  }

  async reorderLinks(pageId: string, linkIds: string[]): Promise<void> {
    // Update order for each link in a transaction
    await prisma.$transaction(
      linkIds.map((linkId, index) =>
        prisma.link.update({
          where: { id: linkId, pageId },
          data: { order: index },
        })
      )
    )
  }
}
