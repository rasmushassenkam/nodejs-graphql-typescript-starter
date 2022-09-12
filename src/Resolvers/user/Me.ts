import { Resolver, Query, Ctx } from "type-graphql";
import { User, UserModel } from "../../entities/User";
import { IContext } from "../../types/IContext";

@Resolver(() => User)
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: IContext): Promise<User | null> {
    if (!context.req.session.userId) {
      return null;
    }
    return UserModel.findOne({ _id: context.req.session.userId });
  }
}
