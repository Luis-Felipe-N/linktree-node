import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface LinkProps {
  pageId: UniqueEntityID
  url: string
  order: number
  title?: string | null
  thumbnailUrl?: string | null
  clickCount: number
  highlightEffect?: string | null
  active: boolean
  created_at: Date
  updated_at?: Date | null
}

export class Link extends Entity<LinkProps> {
  get pageId() { return this.props.pageId }
  get url() { return this.props.url }
  get order() { return this.props.order }
  get title() { return this.props.title }
  get thumbnailUrl() { return this.props.thumbnailUrl }
  get clickCount() { return this.props.clickCount }
  get highlightEffect() { return this.props.highlightEffect }
  get active() { return this.props.active }
  get created_at() { return this.props.created_at }
  get updated_at() { return this.props.updated_at }

  set url(url: string) { this.props.url = url; this.touch() }
  set order(order: number) { this.props.order = order; this.touch() }
  set title(title: string | null | undefined) { this.props.title = title; this.touch() }
  set thumbnailUrl(url: string | null | undefined) { this.props.thumbnailUrl = url; this.touch() }
  set highlightEffect(effect: string | null | undefined) { this.props.highlightEffect = effect; this.touch() }
  set active(active: boolean) { this.props.active = active; this.touch() }


  public incrementClickCount() {
    this.props.clickCount++
  }

  private touch() {
    this.props.updated_at = new Date()
  }

  static create(
    props: Omit<LinkProps, 'created_at' | 'updated_at' | 'clickCount' | 'active'> & {
         active?: boolean, 
         clickCount?: number
    },
    id?: UniqueEntityID,
  ) {
    const link = new Link(
      {
        ...props,
        clickCount: props.clickCount ?? 0,
        active: props.active ?? true,
        created_at: new Date(),
        updated_at: null,
      },
      id,
    )
    return link
  }
}