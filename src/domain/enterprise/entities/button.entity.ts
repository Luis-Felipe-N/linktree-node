import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type ButtonStyle = 'filled' | 'outline' | 'soft-shadow' | 'hard-shadow' // Exemplo

export interface ButtonProps {
  style: ButtonStyle
  color: string // Cor principal (fundo/borda)
  text_color: string // Cor do texto
  fontFamily?: string | null
  fontWeight?: string | null // 'normal', 'bold'
  shadowStyle?: string | null // 'none', 'soft', 'hard'
  shadowColor?: string | null
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
  get active() { return this.props.active }
  get created_at() { return this.props.created_at }

  // Setters podem ser adicionados

  static create(
    props: Omit<ButtonProps, 'created_at' | 'active'> & { active?: boolean },
    id?: UniqueEntityID,
  ) {
    const button = new Button(
      {
        ...props,
        active: props.active ?? true,
        created_at: new Date(),
      },
      id,
    )
    return button
  }
}