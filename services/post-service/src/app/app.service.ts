import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostRequestDto } from './dto/request/create-post.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/post.entity';
import { Repository } from 'typeorm';
import { AppError, Logger } from 'src/utils';
import { I18nService } from 'nestjs-i18n';
import { FindManyPostsRequestDto, FindPostByIdRequestDto } from './dto/request/find-post.request.dto';
import { UpdatePostRequestDto } from './dto/request/update-post.request.dto';

@Injectable()
export class AppService {

  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ){}

  async createBlogPost({ dto }: { dto: CreatePostRequestDto }): Promise<BlogPost> {
    
    const newPost = await this.blogPostRepository.save(
      this.blogPostRepository.create({
        title: dto.title,
        content: dto.content,
        authorId: dto.userId,
        imageUrl: dto.imageUrl,
      }),
    );

    Logger.logMessage({
      message: 'New post created',
      functionName: 'createBlogPost',
      metaInfo: {
        authorId: dto.userId,
        postId: newPost.id,
      }
    });

    return newPost;
  }

  async findOnePost({ dto }: { dto: FindPostByIdRequestDto }): Promise<BlogPost> {
    
    const foundPost = await this.blogPostRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!foundPost) {
      throw AppError(
        this.i18n,
        {
          status: HttpStatus.NOT_FOUND,
          identifiers: ['post.notFound']
        },
      );
    }

    return foundPost;
  }

  async findManyPosts({ dto }: { dto: FindManyPostsRequestDto}): Promise<[BlogPost[], number]> {
    return await this.blogPostRepository.findAndCount({
      where: {
        authorId: dto.authorId,
      },
      order: {
        createdAt: 'DESC'
      },
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit
    });
  }

  async updateOnePost({ dto }: { dto: UpdatePostRequestDto}): Promise<BlogPost> {
    const foundPost = await this.findOnePost({ dto: { id: dto.id } });

    await this.blogPostRepository.update(
      {
        id: foundPost.id,
      },
      {
        title: dto.title,
        content: dto.content,
        imageUrl: dto.imageUrl,
      },
    );

    Logger.logMessage({
      message: 'Post updated',
      functionName: 'updateOnePost',
      metaInfo: {
        postId: foundPost.id,
      }
    });

    return await this.blogPostRepository.findOne({
      where: {
        id: dto.id,
      },
    });
  }

  async deleteOnePost({ dto }: { dto: FindPostByIdRequestDto}): Promise<void> {
    const foundPost = await this.findOnePost({ dto: { id: dto.id } });

    await this.blogPostRepository.delete({
      id: foundPost.id,
    });

    Logger.logMessage({
      message: 'Post deleted',
      functionName: 'deleteOnePost',
      metaInfo: {
        postId: foundPost.id,
      }
    });

    return;
  }
}
