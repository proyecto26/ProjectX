import { AuthLoginDto, AuthResponseDto, AuthVerifyDto } from '@projectx/models';
import { Controller, HttpCode, HttpStatus, Body, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Login with email',
    description: 'This endpoint allow a user to login with email',
  })
  @ApiCreatedResponse({
    description: 'The email for login was sent successfully',
  })
  @ApiBadRequestResponse({
    description: 'There was an error sending the email',
  })
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() body: AuthLoginDto) {
    return this.appService.sendLoginEmail(body);
  }

  @ApiOperation({
    summary: 'Verify login code',
    description: 'This endpoint allow a user to verify the login code',
  })
  @ApiOkResponse({
    description: 'The user was verified successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'There was an error verifying the user',
  })
  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  verify(@Body() body: AuthVerifyDto) {
    return this.appService.verifyLoginCode(body);
  }
}
