import { Entity } from '../../../core/entities/entity'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'
import type { Optional } from '../../../core/types/optional'

export type button = 'filled' | 'outline' | 'soft-shadow' | 'hard-shadow' // Exemplo

export interface ButtonProps {
  style: button
  properties?: Record<string, any> | null
  active: boolean
  created_at: Date
}

export class Button extends Entity<ButtonProps> {
  get style() { return this.props.style }
  get properties() { return this.props.properties }
  get active() { return this.props.active }
  get created_at() { return this.props.created_at }

  static create(
    props: Optional<ButtonProps, 'created_at' | 'active'> & {
      created_at?: Date
      active?: boolean
    },
    id?: UniqueEntityID,
  ) {
    const button = new Button(
      {
        ...props,
        active: props.active ?? true,
        created_at: props.created_at ?? new Date(),
      },
      id,
    )
    return button
  }
}