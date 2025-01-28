import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  RawBodyRequest,
  Req,
  UseGuards,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser, AuthUser, JwtAuthGuard } from '@projectx/core';
import { CreateOrderDto } from '@projectx/models';
import { Request } from 'express';

import { AppService } from './app.service';

@ApiTags('Order')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new order and initialize payment',
  })
  @Post()
  async createOrder(
    @AuthenticatedUser() userDto: AuthUser,
    @Body() orderDto: CreateOrderDto
  ) {
    return this.appService.createOrder(userDto, orderDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Check status of the order workflow',
  })
  @ApiParam({
    name: 'referenceId',
    required: true,
    type: String,
    description: 'Reference ID of the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Returns the status of the order workflow',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':referenceId')
  async getOrderStatus(@Param('referenceId') referenceId: string) {
    return this.appService.getOrderStatus(referenceId);
  }

  @Post('/webhook')
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    return this.appService.handleWebhook(request.rawBody, signature);
  }
}
