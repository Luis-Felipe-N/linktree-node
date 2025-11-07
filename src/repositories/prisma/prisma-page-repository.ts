import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Page } from '@/domain/enterprise/entities/page.entity'
import type { PagesRepository } from '../page-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaPagesRepository implements PagesRepository {
  /**
   * Cria uma nova página no banco de dados.
   * @param data - Dados da página a ser criada (entidade Page).
   * @returns A página criada como entidade.
   */
  async create(data: Page): Promise<Page> {
    const page = await prisma.page.create({
      data: {
        id: data.id.toString(),
        slug: data.slug,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        ownerId: data.ownerId.toString(),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt || new Date(),
      },
    })

    return Page.create(
      {
        ownerId: new UniqueEntityID(page.ownerId),
        slug: page.slug,
        title: page.title,
        description: page.description,
        imageUrl: page.imageUrl,
      },
      new UniqueEntityID(page.id),
    )
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

    // Por enquanto, retornar apenas os dados básicos como entidade
    // TODO: incluir relações (links, theme) na entidade se necessário
    return Page.create(
      {
        ownerId: new UniqueEntityID(page.ownerId),
        slug: page.slug,
        title: page.title,
        description: page.description,
        imageUrl: page.imageUrl,
      },
      new UniqueEntityID(page.id),
    )
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

    return Page.create(
      {
        ownerId: new UniqueEntityID(page.ownerId),
        slug: page.slug,
        title: page.title,
        description: page.description,
        imageUrl: page.imageUrl,
      },
      new UniqueEntityID(page.id),
    )
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

    return pages.map((page) =>
      Page.create(
        {
          ownerId: new UniqueEntityID(page.ownerId),
          slug: page.slug,
          title: page.title,
          description: page.description,
          imageUrl: page.imageUrl,
        },
        new UniqueEntityID(page.id),
      ),
    )
  }

  /**
   * Atualiza os dados de uma página existente.
   * @param pageData - Um objeto contendo o ID da página e os campos a serem atualizados.
   * @returns A página atualizada.
   */
  async save(pageData: Prisma.PageUpdateInput & { id: string }) {
    const { id, ...dataToUpdate } = pageData // Separa o ID dos dados de atualização
    const updatedPage = await prisma.page.update({
      where: { id },
      data: dataToUpdate,
    })
    return updatedPage
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