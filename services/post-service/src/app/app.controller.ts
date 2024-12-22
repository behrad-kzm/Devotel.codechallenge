import { Controller, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePostRequestDto } from './dto/request/create-post.request.dto';
import { PostResponseDto } from './dto/response/post.response.dto';
import { FindManyPostsRequestDto, FindPostByIdRequestDto } from './dto/request/find-post.request.dto';
import { infinityPagination } from 'src/utils';
import { UpdatePostRequestDto } from './dto/request/update-post.request.dto';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @MessagePattern('post.create')
  async createPost(
    @Payload(new ValidationPipe({ whitelist: true })) dto: CreatePostRequestDto,
  ) {
    const response = await this.service.createBlogPost({ dto });
    return new PostResponseDto(response);
  }

  @MessagePattern('post.find.one')
  async findOnePost(
    @Payload(new ValidationPipe({ whitelist: true })) dto: FindPostByIdRequestDto,
  ) {
    const response = await this.service.findOnePost({ dto });
    return new PostResponseDto(response);
  }

  @MessagePattern('post.find.many')
  async findManyPost(
    @Payload(new ValidationPipe({ whitelist: true })) dto: FindManyPostsRequestDto,
  ) {
    const response = await this.service.findManyPosts({ dto });
    return infinityPagination(
      response[0].map((post) => new PostResponseDto(post)),
      response[1],
      dto,
    );
  }

  @MessagePattern('post.update.one')
  async updateOnePost(
    @Payload(new ValidationPipe({ whitelist: true })) dto: UpdatePostRequestDto,
  ) {
    const response = await this.service.updateOnePost({ dto });
    return new PostResponseDto(response);
  }

  @MessagePattern('post.delete.one')
  async deleteOnePost(
    @Payload(new ValidationPipe({ whitelist: true })) dto: FindPostByIdRequestDto,
  ) {
    await this.service.deleteOnePost({ dto });
  }
}
