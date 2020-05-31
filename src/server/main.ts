import "reflect-metadata";
import path from "path";
import express from "express";
import ssr from "./controllers/ssr";
import { ApolloServer } from "apollo-server-express";
import * as TypeORM from "typeorm";
import { Container } from "typedi";
import * as TypeGraphQL from "type-graphql";
import { NewsResolver } from "./resolvers";

TypeORM.useContainer(Container);

async function bootstrap() {
  try {
    const app = express();

    await TypeORM.createConnection();

    const schema = await TypeGraphQL.buildSchema({
      resolvers: [NewsResolver],
      container: Container,
      dateScalarMode: "isoDate",
    });
    const server = new ApolloServer({
      schema,
      playground: true,
      introspection: true,
    });
    server.applyMiddleware({ app });

    app.use(express.static(path.join(__dirname, "../../public")));

    if (process.env.NODE_ENV !== "production") {
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
    }

    app.get("*", ssr);
    // eslint-disable-next-line no-console
    app.listen(9000, () =>
      console.log(`Server started http://localhost:9000${server.graphqlPath}`)
    );
  } catch (err) {
    console.log(err.message);
  }
}

bootstrap();
