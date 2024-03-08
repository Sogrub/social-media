import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  content: string

  @Prop({ required: true, default: 0 })
  likes: number

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;

  @Prop({ required: false })
  deletedAt?: Date;

  @Prop({ required: true, type: "ObjectId", ref: 'User' })
  userId: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
