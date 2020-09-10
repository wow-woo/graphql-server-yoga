import { createConfirmationURL } from "./../utils/createConfirmationURL";
import { logger } from "./../middlewares/logger";
import { RegisterInput } from "./register/RegisterInput";
import { User } from "./../../entity/User";
import { Query, Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { isAuth } from "../middlewares/isAuth";
import { sendEmail } from "../utils/sendEmail";

@Resolver()
export class RegisterResolver {
  //uppercase string, it is string class
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return "world";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmationURL(user.id));

    return user;
  }
}
