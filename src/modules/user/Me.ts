import { MyContext } from "./../../../types/MyContext";
import { User } from "./../../entity/User";
import { Query, Resolver, Ctx } from "type-graphql";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    const user = await User.findOne(ctx.req.session!.userId);

    return user;
  }
}
