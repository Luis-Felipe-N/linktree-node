import { Theme } from '@/domain/enterprise/entities/theme.entity'

export interface ThemePresenterOutput {
  id: string
  pageId: string
  title: string
  backgroundId?: string | null
  buttonId?: string | null
  active: boolean
  createdAt: Date
}

export class ThemePresenter {
  static toHTTP(theme: Theme): ThemePresenterOutput {
    return {
      id: theme.id.toString(),
      pageId: theme.pageId.toString(),
      title: theme.title,
      backgroundId: theme.backgroundId?.toString() || null,
      buttonId: theme.buttonId?.toString() || null,
      active: theme.active,
      createdAt: theme.created_at,
    }
  }

  static toHTTPList(themes: Theme[]): ThemePresenterOutput[] {
    return themes.map(theme => this.toHTTP(theme))
  }
}
