"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFetchLinksByPageUseCase = void 0;
const prisma_link_repository_1 = require("@/repositories/prisma/prisma-link-repository");
const fetch_links_by_page_usecase_1 = require("../links/fetch-links-by-page.usecase");
function makeFetchLinksByPageUseCase() {
    const linksRepository = new prisma_link_repository_1.PrismaLinksRepository();
    const useCase = new fetch_links_by_page_usecase_1.FetchLinksByPageUseCase(linksRepository);
    return useCase;
}
exports.makeFetchLinksByPageUseCase = makeFetchLinksByPageUseCase;
