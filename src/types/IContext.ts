import { Response } from "express";
import { IRequest } from "./IRequest";

export interface IContext {
  req: IRequest;
  res: Response;
}
