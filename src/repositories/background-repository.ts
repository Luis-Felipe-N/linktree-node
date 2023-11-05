import { Prisma, Background } from '@prisma/client'

export interface BackgroundRepository {
  create(data: Prisma.BackgroundCreateInput): Promise<Background>
}
