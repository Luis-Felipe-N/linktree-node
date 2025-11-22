import type { Button } from "src/domain/enterprise/entities/button.entity";


export interface ButtonRepository {
  create(data: Button): Promise<Button>
  save(button: Button): Promise<Button>
  findById(id: string): Promise<Button | null>
}
