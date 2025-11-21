import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export type ButtonStyle = 'filled' | 'outline' | 'soft-shadow' | 'hard-shadow' // Exemplo

export interface ButtonProps {
  style: ButtonStyle
  color: string // Cor principal (fundo/borda)
  text_color: string // Cor do texto
  fontFamily?: string | null
  fontWeight?: string | null // 'normal', 'bold'
  shadowStyle?: string | null // 'none', 'soft', 'hard'
  shadowColor?: string | null
  properties?: Record<string, any> | null
  active: boolean
  created_at: Date
}

export class Button extends Entity<ButtonProps> {
  get style() { return this.props.style }
  get color() { return this.props.color }
  get text_color() { return this.props.text_color }
  get fontFamily() { return this.props.fontFamily }
  get fontWeight() { return this.props.fontWeight }
  get shadowStyle() { return this.props.shadowStyle }
  get shadowColor() { return this.props.shadowColor }
  get properties() { return this.props.properties }
  get active() { return this.props.active }
  get created_at() { return this.props.created_at }

  // Setters podem ser adicionados

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