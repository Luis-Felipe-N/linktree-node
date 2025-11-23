import type { Button } from "../domain/enterprise/entities/button.entity";


export interface ButtonRepository {
  create(data: Button): Promise<Button>
  save(button: Button): Promise<Button>
  findById(id: string): Promise<Button | null>
}
