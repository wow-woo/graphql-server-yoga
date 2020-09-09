import "reflect-metadata";
import { createSchema } from "./utils/createSchema";
import { redis } from "./redis";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import session from "express-session";
import cors from "cors";
import connectRedis from "connect-redis";

const main = async () => {
  await createConnection();

  dotenv.config();

  const app = Express();

  // createConnection method will automatically read connection options
  // from your ormconfig file or environment variables

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    //server creates context that you can access in resolvers
    // req, res from express
    //When we pass a function in, Apollo Server will
    //create a new context object on every request
    //and send it to the schema which happens
    //to be created with type-graphql
    context: ({ req, res }: any) => ({ req, res }),
  });

  const RedisStore = await connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, //24hours
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

main();
