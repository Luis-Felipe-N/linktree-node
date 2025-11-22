export class BackgroundPresenter {
  static toHTTP(background: any) {
    return {
      id: background.id.toString(),
      imageUrl: background.imageUrl,
      createdAt: background.created_at,
      properties: background.properties,
    }
  }
}