import { getModelForClass, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Field, ObjectType, Root } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => String)
  readonly _id: ObjectId;

  @Field()
  @prop({ required: true })
  firstName: string;

  @Field()
  @prop({ required: true })
  lastName: string;

  @Field()
  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @Field()
  fullName(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }
}

export const UserModel = getModelForClass(User);
