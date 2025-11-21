import { Page } from '@/domain/enterprise/entities/page.entity'
import type { PagesRepository } from '@/repositories/page-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetPageDetailsUseCaseRequest {
  slug?: string
  id?: string
}

interface GetPageDetailsUseCaseResponse {
  page: Page
}

/**
 * Caso de uso: Buscar detalhes de uma página pelo slug ou ID
 * - Usado para visualização pública de páginas
 * - Requer slug OU id
 */
export class GetPageDetailsUseCase {
  constructor(private pagesRepository: PagesRepository) { }

  async execute({
    slug,
    id,
  }: GetPageDetailsUseCaseRequest): Promise<GetPageDetailsUseCaseResponse> {
    // Valida que pelo menos um parâmetro foi fornecido
    if (!slug && !id) {
      throw new Error('Either slug or id must be provided')
    }

    let page: Page | null = null

    // Busca por slug se fornecido
    if (slug) {
      page = await this.pagesRepository.findBySlug(slug)
    }
    // Se não encontrou por slug ou slug não foi fornecido, busca por ID
    else if (id) {
      page = await this.pagesRepository.findById(id)
    }

    if (!page) {
      throw new ResourceNotFoundError()
    }

    return {
      page,
    }
  }
}
