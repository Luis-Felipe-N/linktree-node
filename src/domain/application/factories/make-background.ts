import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Background, type BackgroundProps } from 'src/domain/enterprise/entities/background.entity'

export function makeBackground(
  data: Partial<BackgroundProps>,
  id?: UniqueEntityID,
): Background {
  return Background.create(
    {
      type: data.type ?? 'color',
      color: data.color ?? null,
      gradientStart: data.gradientStart ?? null,
      gradientEnd: data.gradientEnd ?? null,
      gradientDirection: data.gradientDirection ?? null,
      imageUrl: data.imageUrl ?? null,
      videoUrl: data.videoUrl ?? null,
      style: data.style ?? null,
      properties: data.properties ?? null,
      active: data.active ?? true,
      created_at: data.created_at ?? new Date(),
    },
    id,
  )
}
