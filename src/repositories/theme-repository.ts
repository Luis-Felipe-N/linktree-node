import type { Theme } from "../domain/enterprise/entities/theme.entity"


export interface ThemeRepository {
  create(data: Theme): Promise<Theme>
  save(theme: Theme): Promise<Theme>
  findByPageId(pageId: string): Promise<Theme | null>
}
