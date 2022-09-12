import { Ctx, Mutation, Resolver } from "type-graphql";
import constants from "../../config/constants";
import { IContext } from "../../types/IContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() context: IContext): Promise<boolean> {
    return new Promise((resolve, reject) =>
      context.req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return reject(false);
        }
        context.res.clearCookie(constants.cookie);
        return resolve(true);
      })
    );
  }
}
