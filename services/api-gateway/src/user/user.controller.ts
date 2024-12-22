import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../guards/auth.guard';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(
    private readonly service: UserService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthenticationGuard)
  createUser(
    @Body() data: any,
    @Req() req
  ) {
    return this.service.createUser(req.user.sub ?? null, data);
  }

}
