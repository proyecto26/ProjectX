import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import type { AuthUser } from '@projectx/core';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: createMock<UserService>() },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should call findOneByEmail method correctly', async () => {
      const mockDto = { email: 'test@test.com', id: 1 } as unknown as AuthUser;
      await controller.getProfile(mockDto);

      expect(service.findOne).toHaveBeenCalledWith(mockDto);
    });
  });
});
