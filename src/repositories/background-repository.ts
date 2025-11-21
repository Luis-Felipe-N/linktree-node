import type { Background } from "@/domain/enterprise/entities/background.entity";


export interface BackgroundRepository {
  create(data: Background): Promise<Background>
  save(background: Background): Promise<Background>
  findById(id: string): Promise<Background | null>
}
