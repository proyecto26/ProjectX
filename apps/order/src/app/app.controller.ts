import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
  Param,
  HttpStatus,
  HttpCode,
  Delete,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiHeader,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthenticatedUser, AuthUser, JwtAuthGuard } from '@projectx/core';
import { CreateOrderDto, OrderStatusResponseDto } from '@projectx/models';

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
    type: OrderStatusResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':referenceId')
  async getOrderStatus(@Param('referenceId') referenceId: string) {
    return this.appService.getOrderStatus(referenceId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Cancel an order',
  })
  @Delete(':referenceId')
  async cancelOrder(@Param('referenceId') referenceId: string) {
    return this.appService.cancelOrder(referenceId);
  }

  @ApiOperation({
    summary: 'Handle Stripe webhook events',
    description: 'Endpoint for receiving webhook events from Stripe for payment processing',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe signature for webhook event verification',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook event processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or signature',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/webhook')
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    // Validate and process the webhook
    return this.appService.handleWebhook(request.rawBody, signature);
  }
}
