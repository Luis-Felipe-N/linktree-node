import { UniqueEntityID } from '../../../core/entities/unique-entity-id'
import { Button } from '../../../domain/enterprise/entities/button.entity'
import { Prisma, Button as PrismaButton } from '@prisma/client'

export class PrismaButtonMapper {
  static toDomain(raw: PrismaButton | null): Button | null { // Aceita null e retorna null
    if (!raw) {
      return null
    }

    const properties = (raw.properties as Record<string, any>) || {}

    return Button.create(
      {
        style: raw.style as any,
        properties,
        active: raw.active,
        created_at: raw.created_at,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(button: Button): Prisma.ButtonUncheckedCreateInput {

    return {
      id: button.id.toString(),
      style: button.style,
      properties: button.properties || {},
      active: button.active,
      created_at: button.created_at,
    }
  }
}
