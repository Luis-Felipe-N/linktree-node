import { Link } from 'src/domain/enterprise/entities/link.entity'

export interface LinkPresenterOutput {
  id: string
  pageId: string
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
  created_at: Date
  updated_at?: Date | null
}

export class LinkPresenter {
  static toHTTP(link: Link): LinkPresenterOutput {
    return {
      id: link.id.toString(),
      pageId: link.pageId.toString(),
      url: link.url,
      order: link.order,
      title: link.title,
      thumbnailUrl: link.thumbnailUrl,
      clickCount: link.clickCount,
      highlightEffect: link.highlightEffect,
      scheduledStart: link.scheduledStart,
      scheduledEnd: link.scheduledEnd,
      type: link.type,
      isLocked: link.isLocked,
      active: link.active,
      created_at: link.created_at,
      updated_at: link.updated_at,
    }
  }

  static toHTTPList(links: Link[]): LinkPresenterOutput[] {
    return links.map(l => this.toHTTP(l))
  }
}
