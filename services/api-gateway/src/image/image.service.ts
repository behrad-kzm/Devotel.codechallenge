import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IServiceResponseContract } from '../contracts';

@Injectable()
export class ImageService {
    constructor(
      @Inject('IMAGE_SERVICE') private readonly imageServiceClient: ClientProxy,
    ){}
  
    async uploadImage(file: Express.Multer.File) {
      return this.imageServiceClient.send('image.upload', file);
    }
  
    getImage(fileName: string): Observable<IServiceResponseContract> {
      return this.imageServiceClient.send('image.get', { fileName });
    }
}
