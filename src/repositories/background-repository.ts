import type { Background } from "@/domain/enterprise/entities/background.entity";


export interface BackgroundRepository {
  create(data: Background): Promise<Background>
}
