import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User, UserModel } from "../../entities/User";
import bcryptjs from "bcryptjs";
import { IContext } from "../../types/IContext";

@Resolver(() => User)
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: IContext
  ): Promise<User | null> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return null;
    }

    const valid = await bcryptjs.compare(password, user.password);

    if (!valid) {
      return null;
    }

    context.req.session.userId = user.id;

    return user;
  }
}
