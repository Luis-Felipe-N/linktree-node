import { Entity } from '../../../core/entities/entity'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'
import type { Background } from './background.entity'
import type { Button } from './button.entity'
import type { Optional } from '../../../core/types/optional'

export interface ThemeProps {
  pageId: UniqueEntityID
  background?: Background | null
  button?: Button | null
  active: boolean
  created_at: Date
}

export class Theme extends Entity<ThemeProps> {
  get pageId() { return this.props.pageId }
  get background() { return this.props.background }
  get button() { return this.props.button }
  get active() { return this.props.active }
  get created_at() { return this.props.created_at }

  set background(background: Background | null | undefined) { this.props.background = background; }
  set button(button: Button | null | undefined) { this.props.button = button }
  set active(active: boolean) { this.props.active = active }


  static create(
    props: Optional<ThemeProps, 'created_at' | 'active' | 'background' | 'button'> & {
      created_at?: Date
      active?: boolean
      background?: Background | null
      button?: Button | null
    },
    id?: UniqueEntityID,
  ) {
    const theme = new Theme(
      {
        ...props,
        background: props.background ?? null,
        button: props.button ?? null,
        active: props.active ?? true,
        created_at: props.created_at ?? new Date(),
      },
      id,
    )
    return theme
  }
}