import { ObjectType, Field, ID } from "type-graphql";
import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text", { unique: true })
  name: string;
}
