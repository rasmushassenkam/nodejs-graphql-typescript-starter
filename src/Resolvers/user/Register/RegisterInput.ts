import { Field, InputType } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { Match } from "../../../utils/decorators/matchDecorator";
import { IsEmailAlreadyExist } from "./IsEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "Email already in use" })
  email: string;

  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  password: string;

  @Field()
  @Match("password")
  repeatPassword: string;
}
