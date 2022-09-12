import { Request } from "express";
import { Session } from "express-session";

interface ISession extends Session {
  userId: string;
}

export interface IRequest extends Request {
  session: ISession;
}
