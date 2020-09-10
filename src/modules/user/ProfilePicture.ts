import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Resolver, Mutation, Arg } from "type-graphql";
import { createWriteStream } from "fs";

@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  async addProfilePicture(
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
    return new Promise(async (resolve, reject) => {
      createReadStream().pipe(
        createWriteStream(__dirname + `/../../../images/${filename}`)
          .on("finish", () => resolve(true))
          .on("error", () => reject(false))
      );
    });
  }
}

// '{"query":"mutation AddProfilePicture($picture: Upload!) {\n  addProfilePicture(picture: $picture)\n}\n"}');
