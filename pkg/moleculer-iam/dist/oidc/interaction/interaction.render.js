"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InteractionRenderer {
    constructor(props) {
        this.props = props;
        if (!props.adaptor)
            props.adaptor = loadDefaultInteractionRendererAdaptor(props.logger);
    }
    routes() {
        return this.props.adaptor.routes(this.props.devModeEnabled);
    }
    async render(ctx, props = {}) {
        const { JSON, HTML } = InteractionRenderer.contentTypes;
        const error = props.error;
        const status = ctx.status === 404 ? (error && (error.status || error.statusCode) || 200) : ctx.status;
        // response for ajax
        if (ctx.accepts(JSON, HTML) === JSON) {
            ctx.type = JSON;
            ctx.status = status;
            ctx.body = props;
            return;
        }
        // response redirection
        if (!error && props.redirect) {
            ctx.status = 302;
            ctx.redirect(props.redirect);
            return;
        }
        // response HTML
        ctx.type = HTML;
        ctx.status = status;
        ctx.body = await this.props.adaptor.render(props, this.props.devModeEnabled);
    }
}
exports.InteractionRenderer = InteractionRenderer;
InteractionRenderer.contentTypes = {
    JSON: "application/json",
    HTML: "text/html",
};
function loadDefaultInteractionRendererAdaptor(logger) {
    try {
        // tslint:disable-next-line:no-var-requires
        return require("moleculer-iam-interaction-renderer");
    }
    catch (error) {
        logger.error(error);
        return {
            routes() {
                return [];
            },
            render(props) {
                return `
          <html>
              <body>
                  <div style="background-color:#9b0000; color: white; padding: 2em; font-family: monospace">
                      <p>OIDC interaction renderer has not been configured: can install 'moleculer-iam-interaction-renderer' or set oidc.renderer option.</p>
                      <pre>${JSON.stringify(error, null, 2)}</pre>
                  </div>
                  <hr>
                  <pre>${JSON.stringify(props, null, 2)}</pre>
              </body>
          </html>`;
            },
        };
    }
}
//# sourceMappingURL=interaction.render.js.map