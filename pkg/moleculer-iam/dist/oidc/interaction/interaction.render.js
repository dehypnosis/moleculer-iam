"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InteractionRenderer {
    constructor(props) {
        this.props = props;
    }
    routes() {
        return this.props.adapter.routes(this.props.devModeEnabled);
    }
    async render(ctx, state) {
        const { JSON, HTML } = InteractionRenderer.contentTypes;
        // response for ajax
        if (ctx.accepts(JSON, HTML) === JSON) {
            ctx.type = JSON;
            ctx.body = state.error || state; // response error only for xhr request
            return;
        }
        // response redirection
        if (state.redirect) {
            ctx.status = 302;
            ctx.redirect(state.redirect);
            return;
        }
        // response HTML
        ctx.type = HTML;
        state.metadata = this.props.metadata; // with metadata
        ctx.body = await this.props.adapter.render(state, this.props.devModeEnabled);
    }
}
exports.InteractionRenderer = InteractionRenderer;
InteractionRenderer.contentTypes = {
    JSON: "application/json",
    HTML: "text/html",
};
// function loadDefaultInteractionRendererAdapter(logger: Logger): InteractionRendererAdapter<any> {
//   try {
//     // tslint:disable-next-line:no-var-requires
//     return require("moleculer-iam-interaction-renderer");
//   } catch (error) {
//     logger.error(error);
//
//     return {
//       routes() {
//         return [];
//       },
//       render(state) {
//         return `
//           <html>
//               <body>
//                   <div style="background-color:#9b0000; color: white; padding: 2em; font-family: monospace">
//                       <p>OIDC interaction renderer adapter has not been configured: can install 'moleculer-iam-interaction-renderer' or set oidc.interaction.renderer/rendererOptions option.</p>
//                       <pre>${JSON.stringify(error, null, 2)}</pre>
//                   </div>
//                   <hr>
//                   <pre>${JSON.stringify(state, null, 2)}</pre>
//               </body>
//           </html>`;
//       },
//     };
//   }
// }
//# sourceMappingURL=interaction.render.js.map