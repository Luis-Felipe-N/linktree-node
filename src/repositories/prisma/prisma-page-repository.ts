import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Page } from '@/domain/enterprise/entities/page.entity'
import type { PagesRepository } from '../page-repository'
import { PrismaPageMapper } from './mappers/prisma-page-mapper'

export class PrismaPagesRepository implements PagesRepository {
  async create(data: Page): Promise<Page> {
    const prismaData = PrismaPageMapper.toPrisma(data)

    const page = await prisma.page.create({
      data: prismaData,
    })

    return PrismaPageMapper.toDomain(page)
  }

  async findBySlug(slug: string): Promise<Page | null> {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        links: { where: { active: true }, orderBy: { order: 'asc' } },
        theme: { include: { background: true, button: true } },
        owner: true,
      },
    })

    if (!page) return null

    return PrismaPageMapper.toDetails(page)
  }

  async findById(id: string): Promise<Page | null> {
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        links: { where: { active: true }, orderBy: { order: 'asc' } },
        theme: { include: { background: true, button: true } },
        owner: true,
      }
    })

    if (!page) return null

    return PrismaPageMapper.toDomain(page)
  }

  /**
   * Encontra todas as páginas pertencentes a um usuário específico.
   * @param ownerId - O ID do usuário proprietário.
   * @returns Uma lista de páginas pertencentes ao usuário, ordenadas por data de criação.
   */
  async findByOwnerId(ownerId: string): Promise<Page[]> {
    const pages = await prisma.page.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    })

    return pages.map(PrismaPageMapper.toDomain)
  }

  async save(page: Page): Promise<Page> {
    const prismaData = PrismaPageMapper.toPrisma(page)

    const updatedPage = await prisma.page.update({
      where: { id: page.id.toString() },
      data: {
        title: prismaData.title,
        description: prismaData.description,
        slug: prismaData.slug,
        updatedAt: new Date(),
      },
    })

    return PrismaPageMapper.toDomain(updatedPage)
  }

  async delete(id: string): Promise<void> {
    await prisma.page.delete({
      where: { id },
    })
  }
}