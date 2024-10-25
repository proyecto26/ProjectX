import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { ORDER_API_URL } from '~/constants';
import { OrderStartResponse, OrderStatusResponse } from '../types';

export async function startOrder(
  productId: unknown,
  referenceId = uuidv4(),
  accessToken?: string,
): Promise<OrderStartResponse> {
  const response = await axios.post<OrderStartResponse>(
    ORDER_API_URL,
    {
      referenceId,
      productId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
}

export async function getOrderStatus(
  referenceId: string,
  accessToken?: string,
): Promise<OrderStatusResponse> {
  const response = await axios.get<OrderStatusResponse>(
    `${ORDER_API_URL}/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
}

export async function cancelOrder(
  referenceId: string,
  accessToken?: string,
): Promise<void> {
  await axios.delete(`${ORDER_API_URL}/${referenceId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
