import { Page } from '@/domain/enterprise/entities/page.entity'
import { UserPresenter } from './user-presenter'
import { ThemePresenter } from './theme-presenter'
import { LinkPresenter } from './link-presenter'

export class PagePresenter {
  static toHTTP(page: Page) {
    console.log('PagePresenter.toHTTP', page)
    return {
      id: page.id.toString(),
      slug: page.slug,
      title: page.title,
      description: page.description,
      imageUrl: page.imageUrl,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      owner: page.owner && UserPresenter.toHTTP(page.owner),
      theme: page.theme && ThemePresenter.toHTTP(page.theme),
      links: page.links && page.links.getItems().map(LinkPresenter.toHTTP),
    }
  }
}