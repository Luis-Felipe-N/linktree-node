import type { Button } from "@/domain/enterprise/entities/button.entity";

export class ButtonPresenter {
  static toHTTP(button: Button) {
    return {
      id: button.id.toString(),
      style: button.style,
      createdAt: button.created_at,
      properties: button.properties,
    }
  }
}