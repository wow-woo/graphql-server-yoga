import { Product } from "./../../entity/Product";
import { RegisterInput } from "./register/RegisterInput";
import { User } from "./../../entity/User";
import { ClassType, Arg, InputType, Field } from "type-graphql";
import { Resolver, Mutation } from "type-graphql";

function createUserBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

const BaseCreateUser = createUserBaseResolver(
  "User",
  User,
  RegisterInput,
  User
);

@InputType()
class ProductInput {
  @Field()
  name: string;
}
const BaseCreateProduct = createUserBaseResolver(
  "Product",
  Product,
  ProductInput,
  Product
);

@Resolver()
export class CreateUserResolver extends BaseCreateUser {}

@Resolver()
export class CreateProductResolver extends BaseCreateProduct {}
