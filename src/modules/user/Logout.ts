import { MyContext } from "./../../../types/MyContext";
import { Resolver, Ctx, Mutation } from "type-graphql";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          return reject(false);
        }

        res.clearCookie("qid");

        return resolve(true);
      });
    });
  }
}
