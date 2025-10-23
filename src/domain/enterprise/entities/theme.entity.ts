import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ThemeProps {
  pageId: UniqueEntityID 
  title: string
  backgroundId?: UniqueEntityID | null
  buttonId?: UniqueEntityID | null
  active: boolean
  created_at: Date
}

export class Theme extends Entity<ThemeProps> {
  get pageId() { return this.props.pageId }
  get title() { return this.props.title }
  get backgroundId() { return this.props.backgroundId }
  get buttonId() { return this.props.buttonId }
  get active() { return this.props.active }
  get created_at() { return this.props.created_at }

  set title(title: string) { this.props.title = title } 
  set backgroundId(id: UniqueEntityID | null | undefined) { this.props.backgroundId = id }
  set buttonId(id: UniqueEntityID | null | undefined) { this.props.buttonId = id }
  set active(active: boolean) { this.props.active = active }


  static create(
    props: Omit<ThemeProps, 'created_at' | 'active'> & { active?: boolean },
    id?: UniqueEntityID,
  ) {
    const theme = new Theme(
      {
        ...props,
        active: props.active ?? true,
        created_at: new Date(),
      },
      id,
    )
    return theme
  }
}