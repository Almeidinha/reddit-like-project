import { Property } from "@mikro-orm/core";
import { PrimaryKey } from "@mikro-orm/core/decorators/PrimaryKey";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class BaseEntity {

    @Field(() => Int)
    @PrimaryKey()
    id!: number;
    
    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();
    
    @Field(() => String)
    @Property({type: 'date', onUpdate: () => new Date()})
    updatedAt = new Date();
    
}