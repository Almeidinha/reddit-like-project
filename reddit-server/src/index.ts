import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import connectRedis from "connect-redis";
import cors from "cors";
import { COOKIE_NAME } from "./constants";

import redis from "redis";
import session from "express-session";
import { MyContext } from "./types";
//import { sendEmail } from "./utils/sendEmail";

const main = async () => {
  //sendEmail("blackheal@gmail.com", "<b>Hello noob!!!</b>");

  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
    password: "redis",
  });

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf related stuff
        secure: __prod__, // if prod, will only work in https
      },
      saveUninitialized: false,
      secret: "qwerty_asdfgh_zxcvbn",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false /*"http://localhost:3000"*/,
    },
  });

  app.listen(4001, () => {
    console.log("Server started on localhost:4001.");
  });
};

main().catch((err) => {
  console.log(err);
});
