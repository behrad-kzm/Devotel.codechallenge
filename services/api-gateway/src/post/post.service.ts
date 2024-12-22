import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_SERVICE') private readonly postServiceClient: ClientProxy,
  ) { }

  async createPost(userId: string, data: any) {
    return this.postServiceClient.send('post.create', { ...data, userId });
  }

  async updatePost(id: string, data: any) {
    return this.postServiceClient.send('post.update.one', { ...data, id });
  }

  async getOnePost(id: string) {
    return this.postServiceClient.send('post.find.one', { id });
  }

  async getAllPost(query: any) {
    return this.postServiceClient.send('post.find.many', { ...query });
  }

  async delete(id: string) {
    return this.postServiceClient.send('post.delete.one', { id });
  }
}
