import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import path from "path";
import React from "react";

export default function ssr(req, res): void {
  const nodeStats = path.resolve(
    __dirname,
    "../../../public/dist/node/loadable-stats.json"
  );

  const webStats = path.resolve(
    __dirname,
    "../../../public/dist/web/loadable-stats.json"
  );

  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const context = {};
  const jsx = webExtractor.collectChunks(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const html = renderToString(jsx);
  const helmet = Helmet.renderStatic();

  res.set("content-type", "text/html");
  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          ${webExtractor.getLinkTags()}
          ${webExtractor.getStyleTags()}
          ${helmet.title.toString()}
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
          <link rel="manifest" href="/site.webmanifest">
          <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
        </head>
        <body>
          <div id="main">${html}</div>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `);
}
