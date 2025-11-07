import { Page } from '@/domain/enterprise/entities/page.entity'

export interface PagePresenterOutput {
  id: string
  slug: string
  title?: string | null
  description?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export interface PagePresenterWithOwnerOutput extends PagePresenterOutput {
  ownerId: string
}

export class PagePresenter {
  /**
   * Apresenta uma página sem incluir o ownerId
   * Usado para respostas públicas ou quando o owner já é conhecido
   */
  static toHTTP(page: Page): PagePresenterOutput {
    return {
      id: page.id.toString(),
      slug: page.slug,
      title: page.title,
      description: page.description,
      imageUrl: page.imageUrl,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }
  }

  /**
   * Apresenta uma página incluindo o ownerId
   * Usado quando o owner precisa ser conhecido (listagens, etc)
   */
  static toHTTPWithOwner(page: Page): PagePresenterWithOwnerOutput {
    return {
      id: page.id.toString(),
      ownerId: page.ownerId.toString(),
      slug: page.slug,
      title: page.title,
      description: page.description,
      imageUrl: page.imageUrl,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }
  }

  /**
   * Apresenta múltiplas páginas
   */
  static toHTTPList(pages: Page[]): PagePresenterOutput[] {
    return pages.map(page => this.toHTTP(page))
  }

  /**
   * Apresenta múltiplas páginas com ownerId
   */
  static toHTTPListWithOwner(pages: Page[]): PagePresenterWithOwnerOutput[] {
    return pages.map(page => this.toHTTPWithOwner(page))
  }
}
