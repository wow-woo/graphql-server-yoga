import { ApolloServer } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";

const main = async () => {
  await createConnection();

  dotenv.config();

  // createConnection method will automatically read connection options
  // from your ormconfig file or environment variables

  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => console.log("server started on 4000"));
};

main();
