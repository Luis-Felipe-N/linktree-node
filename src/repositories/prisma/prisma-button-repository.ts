import { Button } from '@/domain/enterprise/entities/button.entity'
import { prisma } from '../../lib/prisma'
import { ButtonRepository } from '../button-repository'

export class PrismaButtonRepository implements ButtonRepository {
  async create(button: Button) {
    const properties: Record<string, any> = {
      color: button.color,
      textColor: button.text_color,
    }

    if (button.fontFamily) properties.fontFamily = button.fontFamily
    if (button.fontWeight) properties.fontWeight = button.fontWeight
    if (button.shadowStyle) properties.shadowStyle = button.shadowStyle
    if (button.shadowColor) properties.shadowColor = button.shadowColor

    await prisma.button.create({
      data: {
        id: button.id.toString(),
        style: button.style.toUpperCase(),
        properties,
        active: button.active,
        created_at: button.created_at,
      }
    })

    return button
  }
}
