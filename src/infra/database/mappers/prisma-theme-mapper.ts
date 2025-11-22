import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Theme } from 'src/domain/enterprise/entities/theme.entity'
import { Prisma, Theme as PrismaTheme, Background, Button } from '@prisma/client'
import { PrismaBackgroundMapper } from './prisma-background-mapper'
import { PrismaButtonMapper } from './prisma-button-mapper'

type ThemeWithDetails = PrismaTheme & {
  background: Background | null
  button: Button | null
}

interface ThemeDetailDTO {
  id: string
  key: string | null | undefined
  editable: boolean | null | undefined
  luminance: string | null | undefined
  typeface: any
  socialStyle: any
  heading: any
  footer: any
  background: Background | null
  button: Button | null
}

export class PrismaThemeMapper {
  static toDomain(raw: ThemeWithDetails): Theme {

    return Theme.create(
      {
        pageId: new UniqueEntityID(raw.pageId),
        background: raw.background ? PrismaBackgroundMapper.toDomain(raw.background) : null,
        button: raw.button ? PrismaButtonMapper.toDomain(raw.button) : null,
        active: raw.active,
        created_at: raw.created_at,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(theme: Theme): Prisma.ThemeUncheckedCreateInput {
    return {
      id: theme.id.toString(),
      pageId: theme.pageId.toString(),
      backgroundId: theme.background ? theme.background.id.toString() : null,
      buttonId: theme.button ? theme.button.id.toString() : null,
      active: theme.active,
      created_at: theme.created_at,
    }
  }

  static toDetails(raw: ThemeWithDetails): ThemeDetailDTO {
    return {
      id: raw.id,
      key: raw.key,
      editable: raw.editable,
      luminance: raw.luminance,
      typeface: raw.typeface,
      socialStyle: raw.socialStyle,
      heading: raw.heading,
      footer: raw.footer,
      background: raw.background,
      button: raw.button,
    }
  }
}