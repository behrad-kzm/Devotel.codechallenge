import { Body, Request, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { RolesGuard, SetRequiredRoles } from '../guards/roles.guard';
import { AuthenticationGuard } from '../guards/auth.guard';
import { USER_ROLE } from '../user/enums/user-roles.enum';

@ApiBearerAuth()
@ApiTags('Post')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostController {
  constructor(
    private readonly service: PostService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SetRequiredRoles(USER_ROLE.ADMIN, USER_ROLE.AUTHOR)
  @UseGuards(AuthenticationGuard, RolesGuard)
  createPost(
    @Body() data: any,
    @Request() req
  ) {
    return this.service.createPost(req.user.id, data);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @SetRequiredRoles(USER_ROLE.ADMIN, USER_ROLE.AUTHOR)
  @UseGuards(AuthenticationGuard, RolesGuard)
  updatePost(
    @Param('id') id: string,
    @Body() data: any
  ) {
    return this.service.updatePost(id, data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SetRequiredRoles(
    USER_ROLE.ADMIN, 
    USER_ROLE.AUTHOR, 
    USER_ROLE.READER
  )
  @UseGuards(AuthenticationGuard, RolesGuard)
  getOnePost(
    @Param('id') id: string
  ) {
    return this.service.getOnePost(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SetRequiredRoles(
    USER_ROLE.ADMIN, 
    USER_ROLE.AUTHOR, 
    USER_ROLE.READER
  )
  @UseGuards(AuthenticationGuard, RolesGuard)
  getAllPost(
    @Query() data: any
  ) {
    return this.service.getAllPost(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SetRequiredRoles(
    USER_ROLE.ADMIN, 
    USER_ROLE.AUTHOR
  )
  @UseGuards(AuthenticationGuard, RolesGuard)
  deletePost(
    @Param('id') id: string
  ) {
    return this.service.delete(id);
  }
}
