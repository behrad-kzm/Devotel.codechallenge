import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IServiceResponseContract } from '../contracts';

@Injectable()
export class UserService {

  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ){}

  async createUser(sub: string, data: any): Promise<IServiceResponseContract> {
     const res: IServiceResponseContract = await firstValueFrom(this.userServiceClient.send('user.create', { ...data, sub}));
     return res;
  }
}
