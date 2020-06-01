import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import path from "path";
import React from "react";
import { ServerStyleSheets } from "@material-ui/core/styles";

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
  const { default: AppContainer } = nodeExtractor.requireEntrypoint();

  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const context = {};

  const sheets = new ServerStyleSheets();

  const jsx = webExtractor.collectChunks(
    <StaticRouter location={req.url} context={context}>
      <AppContainer />
    </StaticRouter>
  );

  const html = renderToString(sheets.collect(jsx));
  const helmet = Helmet.renderStatic();
  // Grab the CSS from the sheets.
  const css = sheets.toString();

  res.set("content-type", "text/html");
  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          ${webExtractor.getLinkTags()}
          ${webExtractor.getStyleTags()}
          ${helmet.title.toString()}
          <style id="jss-server-side">${css}</style>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="manifest" href="/site.webmanifest">
        </head>
        <body>
          <div id="main">${html}</div>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `);
}
