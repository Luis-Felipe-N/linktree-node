import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Button } from '@/domain/enterprise/entities/button.entity'
import { Prisma, Button as PrismaButton } from '@prisma/client'

export class PrismaButtonMapper {
  static toDomain(raw: PrismaButton | null): Button | null { // Aceita null e retorna null
    if (!raw) {
      return null
    }

    const properties = (raw.properties as Record<string, any>) || {}

    return Button.create(
      // ... mapeamento de propriedades
      {
        style: raw.style as any,
        color: properties.color || '#000000',
        text_color: properties.textColor || '#FFFFFF',
        fontFamily: properties.fontFamily || null,
        fontWeight: properties.fontWeight || null,
        shadowStyle: properties.shadowStyle || null,
        shadowColor: properties.shadowColor || null,
        active: raw.active,
        created_at: raw.created_at,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(button: Button): Prisma.ButtonUncheckedCreateInput {
    const properties: Record<string, any> = {
      color: button.color,
      textColor: button.text_color,
    }

    if (button.fontFamily) properties.fontFamily = button.fontFamily
    if (button.fontWeight) properties.fontWeight = button.fontWeight
    if (button.shadowStyle) properties.shadowStyle = button.shadowStyle
    if (button.shadowColor) properties.shadowColor = button.shadowColor

    return {
      id: button.id.toString(),
      style: button.style,
      properties,
      active: button.active,
      created_at: button.created_at,
    }
  }
}
