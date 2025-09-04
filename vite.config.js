"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    test: {
        dir: 'src',
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    dir: 'src/use-cases',
                },
            },
            {
                extends: true,
                test: {
                    name: 'e2e',
                    dir: 'src/http/controllers',
                    environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
                },
            },
        ],
    },
});
