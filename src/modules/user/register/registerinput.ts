//input for resolver.
import { PasswordMixin } from "./../../shared/PasswordInput";
import { Length, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  @Length(1, 30, { message: "first name must to be in 1 ~ 30 length" })
  firstName: string;

  @Field()
  @Length(1, 30, { message: "last name must to be in 1 ~ 30 length" })
  lastName: string;

  @Field()
  @IsEmail()
  //custom decorator
  @IsEmailAlreadyExist({ message: "Email already in use" })
  email: string;
}
