import type { Link } from '@/domain/enterprise/entities/link.entity'

export interface LinksRepository {
  create(data: Link): Promise<Link>
  findById(id: string): Promise<Link | null>
  findByPageId(pageId: string): Promise<Link[]>
  update(link: Link): Promise<Link>
  delete(id: string): Promise<void>
  reorderLinks(pageId: string, linkIds: string[]): Promise<void>
}
