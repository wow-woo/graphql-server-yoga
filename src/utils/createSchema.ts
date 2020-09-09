import { buildSchema } from "type-graphql";

export const createSchema = () =>
  buildSchema({
    resolvers: [
      __dirname + "/../modules/*/*.ts",
      // RegisterResolver,
      // LoginResolver,
      // MeResolver,
      // ConfirmUser,
      // ForgotPasswordResolver,
    ],
    validate: true,
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
