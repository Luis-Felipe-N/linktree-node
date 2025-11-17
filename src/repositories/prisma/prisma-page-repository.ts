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

  /**
   * Encontra uma página pelo seu slug único, incluindo detalhes relacionados.
   * @param slug - O slug da página a ser encontrada.
   * @returns A página com detalhes (links, tema, dono) ou null se não encontrada.
   */
  async findBySlug(slug: string): Promise<Page | null> {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        // Inclui links ativos, ordenados pela propriedade 'order'
        links: { where: { active: true }, orderBy: { order: 'asc' } },
        // Inclui o tema associado, com seus detalhes de background e button
        theme: { include: { background: true, button: true } },
        // Inclui informações públicas selecionadas do proprietário
        owner: { select: { username: true, id: true } },
      },
    })

    if (!page) return null

    return PrismaPageMapper.toDomain(page)
  }

  /**
   * Encontra uma página pelo seu ID.
   * @param id - O ID da página a ser encontrada.
   * @returns A página encontrada ou null se não encontrada.
   */
  async findById(id: string): Promise<Page | null> {
    const page = await prisma.page.findUnique({
      where: { id },
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
      orderBy: { createdAt: 'asc' }, // Ordena as páginas do usuário
    })

    return PrismaPageMapper.toDomainList(pages)
  }

  /**
   * Atualiza os dados de uma página existente.
   * @param page - A entidade Page com os dados atualizados.
   * @returns A página atualizada.
   */
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

  /**
   * Deleta uma página pelo seu ID.
   * ATENÇÃO: Isso também pode deletar dados relacionados em cascata, dependendo da configuração do schema.
   * @param id - O ID da página a ser deletada.
   */
  async delete(id: string): Promise<void> {
    // Adicionar lógica transacional se necessário para deletar dependências
    // como Links e Theme antes, se não houver cascade delete configurado.
    await prisma.page.delete({
      where: { id },
    })
  }
}