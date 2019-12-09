"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
function withAfterLoading(WrappedComponent) {
    return class extends react_1.default.Component {
        render() {
            return <WrappedComponent {...this.props}/>;
        }
        afterLoading(callback) {
            if (this.state.loading)
                return;
            this.setState({ loading: true, errors: {} }, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    yield callback();
                }
                catch (error) {
                    console.error(error);
                    this.setState({ errors: { global: error.toString() } });
                }
                finally {
                    this.setState({ loading: false });
                }
            }));
        }
    };
}
exports.withAfterLoading = withAfterLoading;
//# sourceMappingURL=hoc.js.map