import { AuthLoginDto } from '@projectx/models';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Post,
} from '@nestjs/common';

import { AppService } from './app.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Login with email',
    description: 'This endpoint allow a user to login with email',
  })
  @ApiOkResponse({
    description: 'The email for login was sent successfully',
  })
  @ApiBadRequestResponse({
    description: 'There was an error sending the email',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: AuthLoginDto) {
    return this.appService.sendLoginEmail(body);
  }
}
