//input for resolver.
import { Length, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
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

  @Field()
  password: string;
}
