import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Theme } from '@/domain/enterprise/entities/theme.entity'
import { Prisma, Theme as PrismaTheme, Background, Button } from '@prisma/client'
import { PrismaBackgroundMapper } from './prisma-background-mapper'
import { PrismaButtonMapper } from './prisma-button-mapper'

type ThemeWithDetails = PrismaTheme & {
  background: Background
  button: Button
}

interface ThemeDetailDTO {
  id: string
  title: string
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
    // console.log("Mapping Prisma theme to domain:", raw);
    return Theme.create(
      {
        pageId: new UniqueEntityID(raw.pageId),
        background: PrismaBackgroundMapper.toDomain(raw.background),
        button: PrismaButtonMapper.toDomain(raw.button),
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
      background: raw.background ?? PrismaBackgroundMapper.toDomain(raw.background),
      button: raw.button ?? PrismaButtonMapper.toDomain(raw.button),
    }
  }
}