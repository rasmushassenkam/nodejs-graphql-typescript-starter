import "reflect-metadata";
import path from "path";
import express, { Application } from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { connect } from "mongoose";
import { RegisterResolver } from "./Resolvers/user/Register/Register";
import { TypegooseMiddleware } from "./middleware/typegoose-middleware";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import { LoginResolver } from "./Resolvers/user/Login";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { MeResolver } from "./Resolvers/user/Me";
import { LogoutResolver } from "./Resolvers/user/Logout";
import constants from "./config/constants";

const main = async () => {
  require("dotenv").config();

  const mongoose = await connect(process.env.MONGO_DB_URI!);
  const db = mongoose.connection;
  db.on("error", (err) => {
    console.log("### DB ERROR ###", err);
  });

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver, LogoutResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    globalMiddlewares: [TypegooseMiddleware],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });

  const app: Application = express();

  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: constants.cookie,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await apolloServer.start();

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  apolloServer.applyMiddleware({
    app,
  });

  app.listen(process.env.PORT || constants.PORT, async () => {
    console.log("App listening on PORT: ", constants.PORT);
  });
};

main();
