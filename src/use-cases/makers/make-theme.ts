import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Theme } from "@/domain/enterprise/entities/theme.entity";

export function maketheme(themeData: Partial<Theme>): Theme {
  console.log("Making theme with data:", themeData);
  const theme = Theme.create({
    pageId: themeData.pageId ?? new UniqueEntityID(),
    background: themeData.background,
    button: themeData.button,
    active: themeData.active,
  });

  return theme;
}