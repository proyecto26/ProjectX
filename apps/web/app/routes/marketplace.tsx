import type { MetaFunction } from '@remix-run/node';

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

export default function Index() {
  return (
    <PageLayout title="ProjectX">
      <MarketplacePage />
    </PageLayout>
  );
}
