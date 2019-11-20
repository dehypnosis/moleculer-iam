"use strict";
/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const GreeterService = {
    name: "auth",
    /**
     * Default settings
     */
    settings: {},
    /**
     * Actions
     */
    actions: {
        test(ctx) {
            return "Hello " + (ctx.params.name || "Anonymous");
        },
    },
    /**
     * Methods
     */
    methods: {},
    /**
     * Service created lifecycle event handler
     */
    created() {
    },
    /**
     * Service started lifecycle event handler
     */
    started() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    },
    /**
     * Service stopped lifecycle event handler
     */
    stopped() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    },
};
module.exports = GreeterService;
//# sourceMappingURL=greeter.service.js.map