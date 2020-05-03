import path from "path";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

const app = express();

app.use(express.static(path.join(__dirname, "../../public")));

if (process.env.NODE_ENV !== "production") {
  (async (): Promise<void> => {
    const { default: webpackConfig } = await import("../../webpack.config");
    const { default: webpackDevMiddleware } = await import(
      "webpack-dev-middleware"
    );
    const { default: webpack } = await import("webpack");
    const compiler = webpack(webpackConfig);

    app.use(
      webpackDevMiddleware(compiler, {
        logLevel: "silent",
        publicPath: "/dist/web",
        writeToDisk(filePath) {
          return (
            /dist\/node\//.test(filePath) || /loadable-stats/.test(filePath)
          );
        },
      })
    );
  })();
}

const nodeStats = path.resolve(
  __dirname,
  "../../public/dist/node/loadable-stats.json"
);

const webStats = path.resolve(
  __dirname,
  "../../public/dist/web/loadable-stats.json"
);

app.get("*", (req, res) => {
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
});

// eslint-disable-next-line no-console
app.listen(9000, () => console.log("Server started http://localhost:9000"));
