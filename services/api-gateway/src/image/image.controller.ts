import { Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { RolesGuard, SetRequiredRoles } from '../guards/roles.guard';
import { AuthenticationGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { USER_ROLE } from '../user/enums/user-roles.enum';
import { Response } from 'express';
import { Logger } from '../utils';

@ApiBearerAuth()
@ApiTags('Image')
@Controller({
  path: 'images',
  version: '1',
})
export class ImageController {
  constructor(
    private readonly service: ImageService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SetRequiredRoles(USER_ROLE.ADMIN, USER_ROLE.AUTHOR)
  @UseGuards(AuthenticationGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadImage(file);
  }

  @Get(':fileName')
  @HttpCode(HttpStatus.OK)
  @SetRequiredRoles(USER_ROLE.ADMIN, USER_ROLE.AUTHOR, USER_ROLE.READER)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getImage(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const responseObservable = this.service.getImage(fileName);
    responseObservable
      .subscribe({
        next: (value) => {
          if (value.status < 400) {
            return res.write(Buffer.from(value.data));
          }

          return res.status(value.status).send(value.data);
        },
        error: (error) => {
          Logger.logError({
            functionName: 'ImageController.getImage',
            message: 'Failed to retrieve image',
            error,
          });
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to retrieve image');
        },
        complete: () => res.end(),
      });
  }
}
