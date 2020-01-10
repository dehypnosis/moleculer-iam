"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
function useWithLoading() {
    const [loading, setLoading] = react_1.useState(false);
    const [errors, setErrors] = react_1.useState({});
    const withLoading = react_1.useCallback((callback) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (loading)
            return;
        setLoading(true);
        setErrors({});
        try {
            yield callback();
        }
        catch (error) {
            console.error(error);
            setErrors({ global: error.toString() });
        }
        finally {
            setTimeout(() => setLoading(false), 500);
        }
    }), [loading]);
    // @ts-ignore
    function wrapWithLoading(callback, deps) {
        // @ts-ignore
        return react_1.useCallback((...args) => withLoading(() => callback(args)), deps.concat(withLoading));
    }
    return {
        withLoading: wrapWithLoading,
        loading,
        setLoading,
        errors,
        setErrors,
    };
}
exports.useWithLoading = useWithLoading;
function useClose(opts) {
    const { tryBack = false } = opts || {};
    const [closed, setClosed] = react_1.useState(false);
    const close = react_1.useCallback(() => {
        if (tryBack) {
            window.history.back();
            setTimeout(() => {
                window.close();
                setTimeout(() => {
                    setClosed(true);
                }, 1000);
            }, 500);
        }
        else {
            window.close();
            setTimeout(() => {
                setClosed(true);
            }, 1000);
        }
    }, []);
    return {
        closed, setClosed, close,
    };
}
exports.useClose = useClose;
//# sourceMappingURL=hook.js.map