import { Entity } from '../../../core/entities/entity'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'
import type { Optional } from '../../../core/types/optional'

export type BackgroundType = 'color' | 'gradient' | 'image' | 'video'

export interface BackgroundProps {
  type: BackgroundType
  color?: string | null
  gradientStart?: string | null
  gradientEnd?: string | null
  gradientDirection?: string | null
  imageUrl?: string | null
  videoUrl?: string | null
  style?: string | null // CSS customizado ou flags
  properties?: Record<string, any> | null
  active: boolean
  created_at: Date
}

export class Background extends Entity<BackgroundProps> {
  get type() { return this.props.type }
  get color() { return this.props.color }
  get gradientStart() { return this.props.gradientStart }
  get gradientEnd() { return this.props.gradientEnd }
  get gradientDirection() { return this.props.gradientDirection }
  get imageUrl() { return this.props.imageUrl }
  get videoUrl() { return this.props.videoUrl }
  get style() { return this.props.style }
  get properties() { return this.props.properties }
  get active() { return this.props.active }
  get created_at() { return this.props.created_at }

  // Setters podem ser adicionados se houver regras de negócio complexas

  static create(
    props: Optional<BackgroundProps, 'created_at' | 'active'> & {
      created_at?: Date
      active?: boolean
    },
    id?: UniqueEntityID,
  ) {
    // TODO: Adicionar validação (ex: se type='color', color não pode ser nulo)
    const background = new Background(
      {
        ...props,
        active: props.active ?? true,
        created_at: props.created_at ?? new Date(),
      },
      id,
    )
    return background
  }
}