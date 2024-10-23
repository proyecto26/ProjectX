import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, UserDto } from '@projectx/models';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepositoryService {
  private logger = new Logger(UserRepositoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<UserDto> {
    this.logger.verbose(`createUser(${data.email})`);
    const user = await this.prisma.user.create({
      data,
    });
    const userDto = plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
    return userDto;
  }

  async findOneByEmail(email: string): Promise<UserDto | null> {
    this.logger.verbose(`findOneByEmail(${email})`);
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
