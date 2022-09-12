import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { User, UserModel } from "../../../entities/User";
import { isAuth } from "../../../middleware/isAuth";
import hashPassword from "../../../utils/hashPassword";
import { RegisterInput } from "./RegisterInput";

@Resolver(() => User)
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => User)
  async register(
    @Arg("input")
    { email, firstName, lastName, password, repeatPassword }: RegisterInput
  ): Promise<User> {
    const newUser = new UserModel({
      email,
      firstName,
      lastName,
    } as User);

    const hashedPassword = await hashPassword(password);
    newUser.password = hashedPassword;

    await newUser.save();

    return newUser;
  }
}
