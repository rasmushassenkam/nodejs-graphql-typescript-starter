import { MiddlewareFn } from "type-graphql";
import { IContext } from "../types/IContext";

export const isAuth: MiddlewareFn<IContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not authenticated");
  }
  return next();
};
