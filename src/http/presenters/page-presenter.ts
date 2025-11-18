import { Page } from '@/domain/enterprise/entities/page.entity'
import { PageDetails } from '@/repositories/prisma/mappers/prisma-page-mapper'

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

export interface PagePresenterWithDetailsOutput extends PagePresenterOutput {
  owner?: {
    id: string
    username: string
    email: string
  }
  theme?: {
    id: string
    title: string
    key?: string | null
    editable?: boolean | null
    luminance?: string | null
    typeface?: any
    socialStyle?: any
    heading?: any
    footer?: any
    background?: {
      id: string
      type: string
      gradientStart?: string | null
      gradientEnd?: string | null
      gradientDirection?: string | null
      imageUrl?: string | null
      videoUrl?: string | null
      style?: string | null
      className?: string | null
      properties?: any
      noise?: boolean | null
    }
    button?: {
      id: string
      style: string
      className?: string | null
      properties?: any
    }
  }
  links?: Array<{
    id: string
    url: string
    order: number
    title?: string | null
    thumbnailUrl?: string | null
    clickCount: number
    highlightEffect?: string | null
    scheduledStart?: Date | null
    scheduledEnd?: Date | null
    type: string
    isLocked: boolean
    active: boolean
  }>
}

export class PagePresenter {

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

  static toHTTPWithDetails(details: PageDetails): PagePresenterWithDetailsOutput {
    const page = details.page

    return {
      id: page.id.toString(),
      slug: page.slug,
      title: page.title,
      description: page.description,
      imageUrl: page.imageUrl,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      owner: details.owner,
      theme: details.theme,
      links: details.links,
    }
  }

  static toHTTPList(pages: Page[]): PagePresenterOutput[] {
    return pages.map(page => this.toHTTP(page))
  }

  static toHTTPListWithOwner(pages: Page[]): PagePresenterWithOwnerOutput[] {
    return pages.map(page => this.toHTTPWithOwner(page))
  }

  static toHTTPListWithDetails(detailsList: PageDetails[]): PagePresenterWithDetailsOutput[] {
    return detailsList.map(details => this.toHTTPWithDetails(details))
  }
}
