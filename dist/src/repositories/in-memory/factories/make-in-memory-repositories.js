"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeInMemoryRepositories = void 0;
const in_memory_background_repository_1 = require("../in-memory-background-repository");
const in_memory_button_repository_1 = require("../in-memory-button-repository");
const in_memory_themes_repository_1 = require("../in-memory-themes-repository");
const in_memory_users_repository_1 = require("../in-memory-users-repository");
function makeInMemoryRepositories() {
    const inMemoryUsersRepository = new in_memory_users_repository_1.InMemoryUsersRepository();
    const inMemoryThemesRepository = new in_memory_themes_repository_1.InMemoryThemesRepository();
    const inMemoryButtonRepository = new in_memory_button_repository_1.InMemoryButtonRepository();
    const inMemoryBackgroundRepository = new in_memory_background_repository_1.InMemoryBackgroundRepository();
    return {
        inMemoryUsersRepository,
        inMemoryThemesRepository,
        inMemoryButtonRepository,
        inMemoryBackgroundRepository,
    };
}
exports.makeInMemoryRepositories = makeInMemoryRepositories;
