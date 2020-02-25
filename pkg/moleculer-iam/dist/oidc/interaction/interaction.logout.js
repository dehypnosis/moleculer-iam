"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.useLogoutInteraction = function (_a) {
    var router = _a.router;
    router.get("/logout", function (ctx) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            // render logout form
            return [2 /*return*/, ctx.redirect("/oidc/session/end")]; // TODO: from config
        });
    }); });
};
//# sourceMappingURL=interaction.logout.js.map