import { Theme } from '../../../domain/enterprise/entities/theme.entity'
import { BackgroundPresenter } from './background-presenter'
import { ButtonPresenter } from './button-presenter'



export class ThemePresenter {

  static toHTTP(theme: Theme) {
    console.log('ThemePresenter.toHTTP called with theme:', theme);
    return {
      id: theme.id.toString(),
      pageId: theme.pageId.toString(),
      background: theme.background ? BackgroundPresenter.toHTTP(theme.background) : null,
      button: theme.button ? ButtonPresenter.toHTTP(theme.button) : null,
      active: theme.active,
      createdAt: theme.created_at,
    }
  }

  static toHTTPList(themes: Theme[]) {
    return themes.map(theme => this.toHTTP(theme))
  }
}
