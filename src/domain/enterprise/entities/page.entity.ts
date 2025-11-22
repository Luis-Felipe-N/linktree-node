import { Entity } from 'src/core/entities/entity'
import { Optional } from 'src/core/types/optional'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import type { Theme } from './theme.entity'
import type { User } from './user.entity'
import type { LinkList } from './link.entity'

export interface PageProps {
  ownerId: UniqueEntityID
  slug: string
  title?: string | null
  description?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
  owner?: User
  theme?: Theme
  links?: LinkList
}

export class Page extends Entity<PageProps> {
  get ownerId() { return this.props.ownerId }
  get slug() { return this.props.slug }
  get title() { return this.props.title }
  get description() { return this.props.description }
  get imageUrl() { return this.props.imageUrl }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }
  get owner() { return this.props.owner }
  get theme() { return this.props.theme }
  get links() { return this.props.links }


  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<PageProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const page = new Page(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: null,
      },
      id,
    )
    return page
  }
}