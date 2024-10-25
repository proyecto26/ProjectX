import { redirect } from '@remix-run/node';

import HomePage from '~/pages/HomePage';
import PageLayout from '~/pages/PageLayout';

export const loader = () => {
  // Set default route to marketplace
  throw redirect('/marketplace');
};

export default function Index() {
  return (
    <PageLayout title="Marketplace">
      <HomePage />
    </PageLayout>
  );
}
