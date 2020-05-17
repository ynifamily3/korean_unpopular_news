import path from "path";
import express from "express";
import ssr from "./controllers/ssr";
import { initialize } from "koalanlp/Util";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";

initialize({
  packages: { KMR: "2.1.4" },
  verbose: true,
});

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.applyMiddleware({ app });

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

app.get("*", ssr);

// eslint-disable-next-line no-console
app.listen(9000, () =>
  console.log(`Server started http://localhost:9000${server.graphqlPath}`)
);
