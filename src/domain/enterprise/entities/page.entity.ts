import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PageProps {
  ownerId: UniqueEntityID
  slug: string
  title?: string | null
  description?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Page extends Entity<PageProps> {
  get ownerId() { return this.props.ownerId }
  get slug() { return this.props.slug }
  get title() { return this.props.title }
  get description() { return this.props.description }
  get imageUrl() { return this.props.imageUrl }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  set slug(slug: string) { this.props.slug = slug; this.touch() }
  set title(title: string | null | undefined) { this.props.title = title; this.touch() }
  set description(description: string | null | undefined) { this.props.description = description; this.touch() }
  set imageUrl(url: string | null | undefined) { this.props.imageUrl = url; this.touch() }


  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Omit<PageProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const page = new Page(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: null,
      },
      id,
    )
    return page
  }
}