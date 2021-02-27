import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UserNamePasswordInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const hashPassword = await argon2.hash(options.password);
    let user;

    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");

      user = result[0];
      //await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505" /*|| error.detail.includes("already exists")*/) {
        // duplicated username
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      } else {
        console.log("message", err.message);
      }
    }

    req.session!.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username could not be found...",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password...",
          },
        ],
      };
    }

    req.session!.userId = user.id;

    return {
      user,
    };
  }
}
