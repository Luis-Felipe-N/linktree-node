import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Theme } from 'src/domain/enterprise/entities/theme.entity'

export function maketheme(themeData: Partial<Theme>, id?: UniqueEntityID): Theme {
  const theme = Theme.create(
    {
      pageId: themeData.pageId ?? new UniqueEntityID(),
      background: themeData.background,
      button: themeData.button,
      active: themeData.active,
    },
    id,
  )

  return theme
}