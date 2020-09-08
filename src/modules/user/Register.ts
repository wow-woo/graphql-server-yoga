import { User } from "./../../entity/User";
import {
  Query,
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import bcrypt from "bcryptjs";

@Resolver(User)
export class RegisterResolver {
  //uppercase string, it is string class
  @Query(() => String, { nullable: true })
  async hello() {
    return "world";
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") f_name: string,
    @Arg("lastName") l_name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName: f_name,
      lastName: l_name,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
