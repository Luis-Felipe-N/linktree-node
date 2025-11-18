"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdateLinkUseCase = void 0;
const prisma_link_repository_1 = require("@/repositories/prisma/prisma-link-repository");
const prisma_page_repository_1 = require("@/repositories/prisma/prisma-page-repository");
const update_link_usecase_1 = require("../update-link.usecase");
function makeUpdateLinkUseCase() {
    const linksRepository = new prisma_link_repository_1.PrismaLinksRepository();
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    const updateLinkUseCase = new update_link_usecase_1.UpdateLinkUseCase(linksRepository, pagesRepository);
    return updateLinkUseCase;
}
exports.makeUpdateLinkUseCase = makeUpdateLinkUseCase;
