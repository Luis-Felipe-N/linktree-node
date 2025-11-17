"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddLinkToPageUseCase = void 0;
const prisma_link_repository_1 = require("../../repositories/prisma/prisma-link-repository");
const prisma_page_repository_1 = require("../../repositories/prisma/prisma-page-repository");
const add_link_to_page_usecase_1 = require("../add-link-to-page.usecase");
function makeAddLinkToPageUseCase() {
    const linksRepository = new prisma_link_repository_1.PrismaLinksRepository();
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    const useCase = new add_link_to_page_usecase_1.AddLinkToPageUseCase(linksRepository, pagesRepository);
    return useCase;
}
exports.makeAddLinkToPageUseCase = makeAddLinkToPageUseCase;
