// import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Button, type ButtonProps } from 'src/domain/enterprise/entities/button.entity'
import type { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export function makeButton(
  data: Partial<ButtonProps>,
  id?: UniqueEntityID,
): Button {
  return Button.create(
    {
      style: data.style ?? 'filled',
      properties: data.properties ?? null,
      active: data.active ?? true,
      created_at: data.created_at ?? new Date(),
    },
    id,
  )
}
