import { MeResolver } from "./modules/user/Me";
import { redis } from "./redis";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import session from "express-session";
import cors from "cors";
import connectRedis from "connect-redis";
import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";

const main = async () => {
  await createConnection();

  dotenv.config();

  const app = Express();

  // createConnection method will automatically read connection options
  // from your ormconfig file or environment variables

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver],
    validate: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    //server creates context that you can access in resolvers
    // req, res from express
    context: ({ req }: any) => ({ req }),
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

  app.listen(4000, () => console.log("server started on 4000"));
};

main();
