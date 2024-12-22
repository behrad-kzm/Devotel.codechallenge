import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AppError } from 'src/utils';
import { I18nService } from 'nestjs-i18n';
import { FindOneUserRequestDto } from './dto/request/find-user.request.dto';

@Injectable()
export class AppService {

  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

  ) { }

  async createUser({ dto }: { dto: CreateUserRequestDto }): Promise<User> {

    const foundUser = await this.userRepository.findOne({
      where: [
        {
          email: dto.email,
        },
        ...(
          dto.sub ? [
            {
              firebaseSub: dto.sub
            }
          ] : [])
      ],
    });

    console.log({
      fud: dto,
      foundUser
    })
    if (foundUser) {
      throw AppError(
        this.i18n,
        {
          status: HttpStatus.BAD_REQUEST,
          identifiers: ['user.alreadyExists']
        },
      );
    }

    const newUser = await this.userRepository.save(
      this.userRepository.create({
        email: dto.email,
        firebaseSub: dto.sub,
        name: dto.name,
        role: dto.role,
      }),
    );

    return newUser;
  }

  async findOneUser({ dto }: { dto: FindOneUserRequestDto }): Promise<User> {

    const foundUser = await this.userRepository.findOne({
      where: {
        ...(dto.id ? { id: dto.id } : {}),
        ...(dto.sub ? { firebaseSub: dto.sub } : {})
      },
    });

    console.log("hi")
    if (!foundUser) {
      throw AppError(
        this.i18n,
        {
          status: HttpStatus.BAD_REQUEST,
          identifiers: ['user.notFound']
        },
      );
    }

    return foundUser;
  }
}
