import { BlogPost } from "../../entities/post.entity";

export class PostResponseDto {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  title: string;
  content: string;
  imageUrl: string;

  constructor(data: BlogPost) {
    this.id = data.id;
    this.updatedAt = data.updatedAt;
    this.createdAt = data.createdAt;
    this.title = data.title;
    this.content = data.content;
    this.imageUrl = data.imageUrl;

  }
}