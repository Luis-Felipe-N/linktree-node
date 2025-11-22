import type { Page } from 'src/domain/enterprise/entities/page.entity'
import type { PagesRepository } from 'src/repositories/page-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'

interface UpdatePageUseCaseRequest {
  pageId: string
  userId: string
  title?: string
  description?: string
  slug?: string
}

interface UpdatePageUseCaseResponse {
  page: Page
}

export class UpdatePageUseCase {
  constructor(private pagesRepository: PagesRepository) { }

  async execute({
    pageId,
    userId,
    title,
    description,
    slug,
  }: UpdatePageUseCaseRequest): Promise<UpdatePageUseCaseResponse> {
    const page = await this.pagesRepository.findById(pageId)

    if (!page) {
      throw new ResourceNotFoundError()
    }

    // Verifica se o usuário é dono da página
    if (page.ownerId.toString() !== userId) {
      throw new UnauthorizedError()
    }

    // Atualiza apenas os campos fornecidos
    if (title !== undefined) {
      page.title = title
    }

    if (description !== undefined) {
      page.description = description
    }

    if (slug !== undefined) {
      // Verifica se o slug já está em uso por outra página
      const existingPage = await this.pagesRepository.findBySlug(slug)
      if (existingPage && existingPage.id.toString() !== pageId) {
        throw new Error('Slug already in use')
      }
      page.slug = slug
    }

    const updatedPage = await this.pagesRepository.save(page)

    return {
      page: updatedPage,
    }
  }
}
