# Mapeamento Schema Prisma ↔ Frontend Types

Este documento descreve como os modelos do Prisma mapeiam para os tipos TypeScript do frontend.

## Visão Geral

O schema foi atualizado para ser totalmente compatível com os tipos do frontend, utilizando campos JSON para armazenar configurações complexas de aparência (CSSProperties, sub-estilos, etc.).

## Background (backgrounds table)

### Prisma Schema
```prisma
model Background {
  id         String   @id @default(uuid())
  created_at DateTime @default(now())
  active     Boolean  @default(true)

  type              String    // 'COLOR' | 'GRADIENT' | 'IMAGE' | 'VIDEO'
  gradientStart     String?
  gradientEnd       String?
  gradientDirection String?
  imageUrl          String?
  videoUrl          String?

  style      String?  // Ex: 'PLAIN'
  className  String?
  properties Json?    // CSSProperties (backgroundColor, backgroundImage, etc)
  noise      Boolean? @default(false)

  themes Theme[]
}
```

### Frontend Type (AppearanceBackground)
```typescript
export interface AppearanceBackground {
  color?: string | null
  style?: string | null
  type?: string | null
  gradientStart?: string | null
  gradientEnd?: string | null
  gradientDirection?: string | null
  className?: string | null
  properties?: CSSProperties | null
  noise?: boolean | null
  image?: string | null
  imageUrl?: string | null
}
```

### Mapeamento
- `type` → `type`
- `gradientStart` → `gradientStart`
- `gradientEnd` → `gradientEnd`
- `gradientDirection` → `gradientDirection`
- `imageUrl` → `imageUrl` e `image` (aliases)
- `videoUrl` → armazenado separadamente
- `style` → `style`
- `className` → `className`
- `properties` (JSON) → `properties` (CSSProperties)
- `noise` → `noise`
- `color` → **removido do schema**, agora vem de `properties.backgroundColor`

### Exemplo de `properties` JSON
```json
{
  "backgroundColor": "#010101",
  "backgroundImage": "url(https://...)",
  "backgroundSize": "cover",
  "backgroundPosition": "center"
}
```

## Button (buttons table)

### Prisma Schema
```prisma
model Button {
  id         String   @id @default(uuid())
  created_at DateTime @default(now())
  active     Boolean  @default(true)

  style String       // Tipo do botão: 'FILL' | 'OUTLINE' | etc
  
  className  String?
  properties Json?    // Objeto completo com backgroundStyle, shadowStyle, cornerStyle, textStyle, shapeStyle

  themes Theme[]
}
```

### Frontend Type (AppearanceButtonStyle)
```typescript
export interface AppearanceButtonStyle {
  type?: string | null
  backgroundStyle?: AppearanceButtonBackgroundStyle | null
  shadowStyle?: AppearanceButtonShadowStyle | null
  cornerStyle?: AppearanceButtonCornerStyle | null
  textStyle?: AppearanceButtonTextStyle | null
  className?: string | null
  shapeStyle?: { properties?: CSSProperties | null } | null
}
```

### Mapeamento
- `style` → `type`
- `properties` (JSON) → objeto completo com:
  - `backgroundStyle: { color, properties }`
  - `shadowStyle: { type, color, properties }`
  - `cornerStyle: { type, properties }`
  - `textStyle: { color, properties }`
  - `shapeStyle: { properties }`
- `className` → `className`

### Exemplo de `properties` JSON
```json
{
  "backgroundStyle": {
    "color": "#FFFFFF1A",
    "properties": { "backgroundColor": "#FFFFFF1A" }
  },
  "shadowStyle": {
    "type": "SHADOW_MEDIUM",
    "color": "#000000",
    "properties": { "boxShadow": "0 4px 16px rgba(0,0,0,0.2)" }
  },
  "cornerStyle": {
    "type": "ROUNDED",
    "properties": { "borderRadius": "24px" }
  },
  "textStyle": {
    "color": "#FFFFFF",
    "properties": { "color": "#FFFFFF", "fontWeight": "600" }
  },
  "shapeStyle": {
    "properties": { "border": "none" }
  }
}
```

**Campos removidos:** `color`, `textColor`, `fontFamily`, `fontWeight`, `shadowStyle` (strings) - agora tudo está em `properties` JSON.

## Theme (themes table)

### Prisma Schema
```prisma
model Theme {
  id         String   @id @default(uuid())
  title      String
  created_at DateTime @default(now())
  active     Boolean  @default(true)

  page   Page   @relation(fields: [pageId], references: [id])
  pageId String @unique

  background   Background? @relation(fields: [backgroundId], references: [id])
  backgroundId String?
  button       Button?     @relation(fields: [buttonId], references: [id])
  buttonId     String?

  // Campos para AppearanceTheme
  key         String?
  editable    Boolean? @default(true)
  luminance   String?  // 'LIGHT' | 'DARK'
  typeface    Json?    // { color, family }
  socialStyle Json?    // { color }
  heading     Json?    // { type, logo, font, color, size, effect, logoSize }
  footer      Json?    // { logoUrl, url, color }
}
```

### Frontend Type (AppearanceTheme)
```typescript
export interface AppearanceTheme {
  key?: string | null
  editable?: boolean | null
  luminance?: Luminance | null  // 'LIGHT' | 'DARK'
  background?: AppearanceBackground | null
  buttonStyle?: AppearanceButtonStyle | null
  socialStyle?: { color?: string | null } | null
  typeface?: AppearanceTypeface | null      // { color, family }
  heading?: AppearanceHeadingOptions | null
  footer?: AppearanceFooter | null
}
```

### Mapeamento
- `key` → `key`
- `editable` → `editable`
- `luminance` → `luminance`
- `backgroundId` → relação → `background` (objeto completo)
- `buttonId` → relação → `buttonStyle` (objeto completo)
- `typeface` (JSON) → `typeface`
- `socialStyle` (JSON) → `socialStyle`
- `heading` (JSON) → `heading`
- `footer` (JSON) → `footer`

### Exemplo de campos JSON

**typeface:**
```json
{ "color": "#FFFFFF", "family": "system" }
```

**socialStyle:**
```json
{ "color": "#FFFFFF" }
```

**heading:**
```json
{
  "type": "text",
  "logo": null,
  "font": "inter",
  "color": "#FFFFFF",
  "size": "large",
  "effect": "none",
  "logoSize": "normal"
}
```

**footer:**
```json
{ "logoUrl": null, "url": null, "color": null }
```

## Presets (Temas Pré-Configurados)

Os presets do frontend (new-york, kyoto, vancouver, etc.) podem ser armazenados criando:

1. Um registro `Background` com as propriedades do background
2. Um registro `Button` com as propriedades do botão
3. Um registro `Theme` vinculado aos IDs acima + campos JSON (typeface, heading, etc.)

### Exemplo: Salvando o preset "New York"

```typescript
// 1. Criar Background
const background = await prisma.background.create({
  data: {
    type: 'COLOR',
    style: 'PLAIN',
    properties: { backgroundColor: '#010101' },
    active: true,
  }
})

// 2. Criar Button
const button = await prisma.button.create({
  data: {
    style: 'FILL',
    properties: {
      backgroundStyle: { color: '#FFFFFF1A', properties: { backgroundColor: '#FFFFFF1A' } },
      shadowStyle: { type: 'SHADOW_MEDIUM', color: '#000000', properties: { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } },
      cornerStyle: { type: 'ROUNDED', properties: { borderRadius: '24px' } },
      textStyle: { color: '#FFFFFF', properties: { color: '#FFFFFF', fontWeight: '600' } },
      shapeStyle: { properties: { border: 'none' } },
    },
    active: true,
  }
})

// 3. Criar Theme vinculado à Page
const theme = await prisma.theme.create({
  data: {
    title: 'New York',
    key: 'new-york',
    editable: true,
    luminance: 'DARK',
    pageId: '<page-uuid>',
    backgroundId: background.id,
    buttonId: button.id,
    typeface: { color: '#FFFFFF', family: 'system' },
    socialStyle: { color: '#FFFFFF' },
    heading: {
      type: 'text',
      logo: null,
      font: 'inter',
      color: '#FFFFFF',
      size: 'large',
      effect: 'none',
      logoSize: 'normal'
    },
    footer: { logoUrl: null, url: null, color: null },
    active: true,
  }
})
```

## Migração Necessária

Após atualizar o schema, execute:

```bash
npx prisma migrate dev --name update_appearance_models
```

Isso criará uma migration que:
- Remove `color` de `backgrounds`
- Remove `color`, `textColor`, `fontFamily`, `fontWeight`, `shadowStyle`, `shadowColor` de `buttons`
- Adiciona campos JSON: `properties`, `className`, `noise` em `backgrounds`
- Adiciona `properties`, `className` em `buttons`
- Adiciona `key`, `editable`, `luminance`, `typeface`, `socialStyle`, `heading`, `footer` em `themes`

## Notas Importantes

1. **JSON vs Colunas:** Optamos por JSON para `properties` para flexibilidade (aceitar qualquer CSSProperties) sem alterar o schema frequentemente.

2. **Validação:** Considere validar os JSONs com Zod nos controllers antes de salvar no banco.

3. **Performance:** Consultas em campos JSON são menos performáticas que colunas indexadas. Para campos frequentemente pesquisados (ex: `type`, `style`), mantemos colunas dedicadas.

4. **Retrocompatibilidade:** Se houver dados antigos com `color`, `textColor`, etc., crie uma migration de dados para mover esses valores para o JSON `properties`.
