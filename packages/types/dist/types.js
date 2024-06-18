"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postParams = exports.loginParams = exports.signupParams = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupParams = zod_1.default.object({
    username: zod_1.default.string().max(12).min(3),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().max(20).min(6)
});
exports.loginParams = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().max(20).min(6)
});
exports.postParams = zod_1.default.object({
    title: zod_1.default.string().min(3),
    content: zod_1.default.string().min(2)
});
