import { InputType, Field } from "type-graphql";

@InputType()
export class UserNamePasswordInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  email: string;
}
