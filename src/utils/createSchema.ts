import { buildSchema } from "type-graphql";
import { ForgotPasswordResolver } from "./../modules/user/forgotPassword";
import { ConfirmUserResolver } from "./../modules/user/ConfirmUser";
import { MeResolver } from "./../modules/user/Me";
import { LogoutResolver } from "./../modules/user/Logout";
import { LoginResolver } from "./../modules/user/Login";
import { RegisterResolver } from "./../modules/user/Register";
import { ChangePasswordResolver } from "./../modules/user/ChangePassword";

export const createSchema = () =>
  buildSchema({
    resolvers: [
      ChangePasswordResolver,
      RegisterResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver,
    ],
    validate: true,
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
