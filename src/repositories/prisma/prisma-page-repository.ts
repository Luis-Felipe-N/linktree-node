import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { Page } from '@/domain/enterprise/entities/page.entity'
import type { PagesRepository } from '../page-repository'

export class PrismaPagesRepository implements PagesRepository {
  /**
   * Cria uma nova página no banco de dados.
   * @param data - Dados da página a ser criada (Prisma.PageUncheckedCreateInput).
   * @returns A página criada.
   */
  async create(data: Page) {
    const page = await prisma.page.create({
      data,
    })
    return page
  }

  /**
   * Encontra uma página pelo seu slug único, incluindo detalhes relacionados.
   * @param slug - O slug da página a ser encontrada.
   * @returns A página com detalhes (links, tema, dono) ou null se não encontrada.
   */
  async findBySlug(slug: string): Promise<PageWithDetails | null> {
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
    // O tipo de retorno do Prisma com 'include' corresponde a PageWithDetails
    return page as PageWithDetails | null // Cast para garantir a tipagem ou null
  }

  /**
   * Encontra uma página pelo seu ID.
   * @param id - O ID da página a ser encontrada.
   * @returns A página encontrada ou null se não encontrada.
   * (Não inclui relações por padrão, adicione 'include' se necessário).
   */
  async findById(id: string) {
    const page = await prisma.page.findUnique({
      where: { id },
      // Exemplo: Adicionar include se precisar dos detalhes aqui também
      // include: {
      //   links: { orderBy: { order: 'asc' } },
      //   theme: { include: { background: true, button: true } },
      //   owner: { select: { username: true, id: true } },
      // },
    })
    return page
  }

  /**
   * Encontra todas as páginas pertencentes a um usuário específico.
   * @param ownerId - O ID do usuário proprietário.
   * @returns Uma lista de páginas pertencentes ao usuário, ordenadas por data de criação.
   */
  async findByOwnerId(ownerId: string) {
    const pages = await prisma.page.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' }, // Ordena as páginas do usuário
    })
    return pages
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