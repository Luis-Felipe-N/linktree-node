"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPageDetailsUseCase = void 0;
const prisma_page_repository_1 = require("../../repositories/prisma/prisma-page-repository");
const get_page_details_usecase_1 = require("../get-page-details.usecase");
function makeGetPageDetailsUseCase() {
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    const useCase = new get_page_details_usecase_1.GetPageDetailsUseCase(pagesRepository);
    return useCase;
}
exports.makeGetPageDetailsUseCase = makeGetPageDetailsUseCase;
