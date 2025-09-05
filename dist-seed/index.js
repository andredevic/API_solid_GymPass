"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_gym_user_1 = __importDefault(require("./create-gym-user"));
async function seed() {
    await (0, create_gym_user_1.default)();
}
seed();
