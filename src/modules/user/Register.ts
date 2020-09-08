import { RegisterInput } from "./register/registerinput";
import { User } from "./../../entity/User";
import { Query, Resolver, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";

@Resolver()
export class RegisterResolver {
  //uppercase string, it is string class
  @Query(() => String, { nullable: true })
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

    return user;
  }
}
