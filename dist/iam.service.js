"use strict";
/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.IamOidcService = {
    name: "iam.oidc",
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    },
    /**
     * Service stopped lifecycle event handler
     */
    stopped() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    },
};
//# sourceMappingURL=iam.service.js.map