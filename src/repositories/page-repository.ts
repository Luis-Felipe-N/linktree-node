import type { Page } from "../domain/enterprise/entities/page.entity"


export interface PagesRepository {
  create(data: Page): Promise<Page>
  save(page: Page): Promise<Page>
  findBySlug(slug: string): Promise<Page | null>
  findById(id: string): Promise<Page | null>
  findByOwnerId(ownerId: string): Promise<Page[]>
}