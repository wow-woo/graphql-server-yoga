//input for resolver.
import { PasswordMixin } from "./../../shared/PasswordInput";
import { InputType, Field } from "type-graphql";

@InputType()
export class ChangePasswordInput extends PasswordMixin(class {}) {
  @Field()
  token: string;
}
