import { json, LoaderFunction } from '@remix-run/node';
import PageLayout from '~/pages/PageLayout';

export const loader: LoaderFunction = () => {
  return json(null, { status: 404 });
};

export default function NotFoundPage() {
  return (
    <PageLayout>
      <h1>Not Found</h1>
    </PageLayout>
  );
}
