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
import { graphqlUploadExpress } from "graphql-upload";
import {
  getComplexity,
  fieldExtensionsEstimator,
  simpleEstimator,
} from "graphql-query-complexity";

const main = async () => {
  await createConnection();

  dotenv.config();

  const app = Express();

  // createConnection method will automatically read connection options
  // from your ormconfig file or environment variables

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    uploads: false,
    //server creates context that you can access in resolvers
    // req, res from express
    //When we pass a function in, Apollo Server will
    //create a new context object on every request
    //and send it to the schema which happens
    //to be created with type-graphql
    context: ({ req, res }: any) => ({ req, res }),
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            /**
             * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
             * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
             */
            const complexity = getComplexity({
              // Our built schema
              schema,
              // To calculate query complexity properly,
              // we have to check only the requested operation
              // not the whole document that may contains multiple operations
              operationName: request.operationName,
              // The GraphQL query document
              query: document,
              // The variables for our GraphQL query
              variables: request.variables,
              // Add any number of estimators. The estimators are invoked in order, the first
              // numeric value that is being returned by an estimator is used as the field complexity.
              // If no estimator returns a value, an exception is raised.
              estimators: [
                // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                fieldExtensionsEstimator(),
                // Add more estimators here...
                // This will assign each field a complexity of 1
                // if no other estimator returned a value.
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            // Here we can react to the calculated complexity,
            // like compare it with max and throw error when the threshold is reached.
            if (complexity > 20) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`
              );
            }
            // And here we can e.g. subtract the complexity point from hourly API calls limit.
            console.log("Used query complexity points:", complexity);
          },
        }),
      },
    ],
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

  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

main();
