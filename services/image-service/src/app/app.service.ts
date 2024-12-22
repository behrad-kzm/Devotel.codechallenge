import { HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageDetails } from './entities/image.entity';
import { Repository } from 'typeorm';
import { AppError, generateNewUUID, ServerError } from '../utils';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { GetImageRequestDto } from './dto/request/image.request.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    @InjectRepository(ImageDetails)
    private imageRepository: Repository<ImageDetails>,
  ) {}

  async uploadImage({ file }: { file: Express.Multer.File }): Promise<ImageDetails> {
    try {
      // Fetch the directory path from configuration
      const storeDir = this.configService.get<string>('app.storeDir');
      if (!storeDir) {
        throw ServerError({
          message: 'Image store directory is not configured.',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      // Ensure the store directory exists, create it if not
      const uploadPath = path.resolve(storeDir);
      try {
        await fsPromises.access(uploadPath, fs.constants.F_OK); // Check if directory exists
      } catch (err) {
        // If directory doesn't exist, create it
        await fsPromises.mkdir(uploadPath, { recursive: true });
      }

      // Generate a unique filename using date and UUID
      const datePart = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const uuidPart = generateNewUUID();
      const combinedString = `${datePart}-${uuidPart}`;
      const fileExtension = path.extname(file.originalname); // Get the original file extension
      const fileName = `${combinedString}${fileExtension}`;

      // Full path to save the file
      const filePath = path.join(uploadPath, fileName);

      console.log('Saving file to:', filePath);
      // Save the file to the directory asynchronously
      const imageBuffer = Buffer.from(file.buffer);
      await fsPromises.writeFile(filePath, imageBuffer);

      // Generate the URL to access the image
      const fileUrl = `/images/${fileName}`;

      // Save image details in the database
      const imageDetails = await this.imageRepository.save(
        this.imageRepository.create({
          url: fileUrl,
        }),
      );

      return imageDetails;
    } catch (error) {
      console.error('Error saving file:', error);
      throw ServerError({
        message: 'Could not upload the image.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getImage({ dto }: { dto: GetImageRequestDto }): Promise<StreamableFile> {

      const fileName = dto.fileName;
      const storeDir = this.configService.get<string>('app.storeDir');
      if (!storeDir) {
        throw ServerError({
          message: 'Image store directory is not configured.',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      const filePath = path.resolve(storeDir, fileName);
      if (!fs.existsSync(filePath)) {
        throw AppError(this.i18n, {
          status: HttpStatus.NOT_FOUND,
          identifiers: ['image.not_found'],
        });
      }

      const readStream = fs.createReadStream(filePath);
      return new StreamableFile(readStream);
  }
}
