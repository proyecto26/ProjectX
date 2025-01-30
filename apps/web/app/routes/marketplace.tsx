import { ProductDto } from '@projectx/models';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import axios from 'axios';

import { productAPIUrl } from '~/config/app.config.server';
import { useProducts } from '~/hooks/useProducts';
import { MarketplacePage } from '~/pages/MarketplacePage';
import PageLayout from '~/pages/PageLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Marketplace' },
    {
      name: 'description',
      content:
        'Browse our wide selection of products in our online marketplace.',
    },
  ];
};

export const loader = async () => {
  try {
    const response = await axios.get<ProductDto[]>(
      `${productAPIUrl}/product`, {
        timeout: 5000,
      }
    )
    return {
      products: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      products: [],
    };
  }
}

export default function Index() {
  const { products: initialProducts } = useLoaderData<typeof loader>();
  const { data: products } = useProducts({
    initialData: initialProducts?.map(product => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    })) as ProductDto[],
  });
  return (
    <PageLayout title="ProjectX">
      <MarketplacePage products={products?.pages ? products?.pages[0] : []} />
    </PageLayout>
  );
}
