import type { CreateOrderDto, OrderStatusResponseDto } from '@projectx/models';
import axios from 'axios';

import { OrderStartResponse } from '../types';

export async function createOrder(
  accessToken: string,
  orderDto: CreateOrderDto,
): Promise<OrderStartResponse> {
  const response = await axios.post<OrderStartResponse>(
    `${window.ENV.ORDER_API_URL}/order`,
    orderDto,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
}

export async function getOrderStatus(
  accessToken: string,
  referenceId: string,
): Promise<OrderStatusResponseDto> {
  const response = await axios.get<OrderStatusResponseDto>(
    `${window.ENV.ORDER_API_URL}/order/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
}

export async function cancelOrder(
  accessToken: string,
  referenceId: string,
): Promise<void> {
  await axios.delete(`${window.ENV.ORDER_API_URL}/order/${referenceId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
