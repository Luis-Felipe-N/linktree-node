import { Button, Prisma } from '@prisma/client'

export interface ButtonRepository {
  create(data: Prisma.ButtonCreateInput): Promise<Button>
}
