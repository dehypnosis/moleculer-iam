const serveStatic = require("koa-static-cache");
const path = require("path");
const fs = require("fs");
const { output } = require("./config");

function loadViews() {
  const html = fs.readFileSync(path.join(output.path, "index.html")).toString();
  const index = html.indexOf("<script");
  return {
    html,
    header: html.substring(0, index),
    footer: html.substring(index),
  };
}
let views;

try {
  views = loadViews();
} catch (err) {
  console.error(err);
}

function render(props, dev) {
  if (dev) {
    views = loadViews();
  }
  let state;
  try {
    state = JSON.stringify(props);
  } catch (error) {
    console.error("failed to stringify server state", props, error);
    state = JSON.stringify({ error: { error: error.name, error_description: error.message }});
  }
  return props
    ? views.header + `<script>window.__SERVER_STATE__=${state};</script>` + views.footer
    : views.html;
}

function routes(dev) {
  return [
    serveStatic(output.path, {
      maxAge: dev ? 0 : 60 * 60 * 24 * 7,
      prefix: output.publicPath,
      dynamic: dev,
      preload: !dev,
    }),
  ];
}

module.exports = {
  render,
  routes,
};
