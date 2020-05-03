import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";
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
  const jsx = webExtractor.collectChunks(<App />);

  const html = renderToString(jsx);

  res.set("content-type", "text/html");
  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
        ${webExtractor.getLinkTags()}
        ${webExtractor.getStyleTags()}
        </head>
        <body>
          <div id="main">${html}</div>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `);
}
