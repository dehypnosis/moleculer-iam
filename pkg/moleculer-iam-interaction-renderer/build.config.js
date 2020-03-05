"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// @ts-ignore
var path_1 = __importDefault(require("path"));
module.exports = {
    webpack: {
        output: {
            path: path_1.default.resolve(__dirname, "./dist"),
            publicPath: "/op/assets/",
        },
    },
};
