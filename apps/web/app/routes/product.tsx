import type { MetaFunction } from '@remix-run/node';
import { ProductDetail } from '~/pages/ProductDetail';
import PageLayout from '~/pages/PageLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Product Detail' },
    { name: 'description', content: 'View the details of a product.' },
  ];
};

export default function Index() {
  return (
    <PageLayout title="ProjectX">
      <ProductDetail />
    </PageLayout>
  );
}
