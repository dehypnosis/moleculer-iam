"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var path_1 = __importDefault(require("path"));
exports.default = {
    output: {
        path: path_1.default.resolve(__dirname, "./dist"),
        publicPath: "/op/assets/",
    },
};
