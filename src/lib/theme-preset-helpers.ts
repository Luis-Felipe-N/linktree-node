/**
 * Helpers para converter entre os presets do frontend (AppearanceTheme)
 * e os modelos do Prisma (Theme, Background, Button).
 * 
 * Use estes helpers nos controllers para facilitar a criação de temas
 * a partir dos presets enviados pelo frontend.
 */

import type { PrismaClient } from '@prisma/client'

/**
 * Interface que representa um preset do frontend (simplificado).
 * Deve corresponder ao tipo AppearanceTheme do frontend.
 */
export interface FrontendThemePreset {
  key?: string
  editable?: boolean
  luminance?: 'LIGHT' | 'DARK'
  background?: {
    type?: string
    color?: string
    style?: string
    gradientStart?: string
    gradientEnd?: string
    gradientDirection?: string
    imageUrl?: string
    videoUrl?: string
    className?: string
    properties?: Record<string, any>
    noise?: boolean
  }
  button?: {
    type?: string
    className?: string
    backgroundStyle?: { color?: string; properties?: Record<string, any> }
    shadowStyle?: { type?: string; color?: string; properties?: Record<string, any> }
    cornerStyle?: { type?: string; properties?: Record<string, any> }
    textStyle?: { color?: string; properties?: Record<string, any> }
    shapeStyle?: { properties?: Record<string, any> }
  }
  typeface?: { color?: string; family?: string }
  socialStyle?: { color?: string }
  heading?: {
    type?: string
    logo?: string | null
    font?: string
    color?: string
    size?: string
    effect?: string
    logoSize?: string
  }
  footer?: { logoUrl?: string | null; url?: string | null; color?: string | null }
}

/**
 * Cria um Background no banco a partir do objeto background do preset.
 */
export async function createBackgroundFromPreset(
  prisma: PrismaClient,
  background: FrontendThemePreset['background'],
) {
  if (!background) return null

  return await prisma.background.create({
    data: {
      type: background.type || 'COLOR',
      gradientStart: background.gradientStart || null,
      gradientEnd: background.gradientEnd || null,
      gradientDirection: background.gradientDirection || null,
      imageUrl: background.imageUrl || null,
      videoUrl: background.videoUrl || null,
      style: background.style || null,
      properties: background.properties || {},
      noise: background.noise ?? false,
      active: true,
    },
  })
}

/**
 * Cria um Button no banco a partir do objeto button do preset.
 */
export async function createButtonFromPreset(
  prisma: PrismaClient,
  button: FrontendThemePreset['button'],
) {
  if (!button) return null

  // Monta o objeto properties que armazenará todos os sub-estilos
  const properties: Record<string, any> = {}

  if (button.backgroundStyle) {
    properties.backgroundStyle = button.backgroundStyle
  }
  if (button.shadowStyle) {
    properties.shadowStyle = button.shadowStyle
  }
  if (button.cornerStyle) {
    properties.cornerStyle = button.cornerStyle
  }
  if (button.textStyle) {
    properties.textStyle = button.textStyle
  }
  if (button.shapeStyle) {
    properties.shapeStyle = button.shapeStyle
  }

  return await prisma.button.create({
    data: {
      style: button.type || 'FILL',
      className: button.className || null,
      properties: Object.keys(properties).length > 0 ? properties : {},
      active: true,
    },
  })
}

/**
 * Cria um Theme completo no banco a partir de um preset do frontend.
 * 
 * @param prisma - Cliente Prisma
 * @param pageId - ID da página à qual o tema será vinculado
 * @param preset - Objeto do preset (AppearanceTheme do frontend)
 * @param title - Título do tema (ex: "New York", "Kyoto")
 * @returns Theme criado
 */
export async function createThemeFromPreset(
  prisma: PrismaClient,
  pageId: string,
  preset: FrontendThemePreset,
  title: string,
) {
  // 1. Criar Background se houver
  const background = await createBackgroundFromPreset(prisma, preset.background)

  // 2. Criar Button se houver
  const button = await createButtonFromPreset(prisma, preset.button)

  // 3. Criar Theme vinculando tudo
  return await prisma.theme.create({
    data: {
      key: preset.key || null,
      editable: preset.editable ?? true,
      luminance: preset.luminance || null,
      pageId,
      backgroundId: background?.id || null,
      buttonId: button?.id || null,
      active: true,
    },
    include: {
      background: true,
      button: true,
    },
  })
}

/**
 * Converte um Theme do Prisma para o formato esperado pelo frontend (AppearanceTheme).
 * Útil para retornar na API.
 */
export function themeToFrontendFormat(theme: any): FrontendThemePreset {
  const result: FrontendThemePreset = {
    key: theme.key || undefined,
    editable: theme.editable ?? true,
    luminance: theme.luminance || undefined,
  }

  // Background
  if (theme.background) {
    result.background = {
      type: theme.background.type,
      style: theme.background.style || undefined,
      gradientStart: theme.background.gradientStart || undefined,
      gradientEnd: theme.background.gradientEnd || undefined,
      gradientDirection: theme.background.gradientDirection || undefined,
      imageUrl: theme.background.imageUrl || undefined,
      videoUrl: theme.background.videoUrl || undefined,
      className: theme.background.className || undefined,
      properties: theme.background.properties || undefined,
      noise: theme.background.noise ?? false,
    }
  }

  // Button
  if (theme.button && theme.button.properties) {
    result.button = {
      type: theme.button.style,
      className: theme.button.className || undefined,
      ...theme.button.properties, // Espalha backgroundStyle, shadowStyle, etc.
    }
  }

  // Outros campos JSON
  if (theme.typeface) result.typeface = theme.typeface
  if (theme.socialStyle) result.socialStyle = theme.socialStyle
  if (theme.heading) result.heading = theme.heading
  if (theme.footer) result.footer = theme.footer

  return result
}
