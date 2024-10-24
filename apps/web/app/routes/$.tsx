import { Layout } from '@projectx/ui';
import { json, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = () => {
  return json(null, { status: 404 });
};

export default function NotFoundPage() {
  return (
    <Layout>
      <h1>Not Found</h1>
    </Layout>
  );
}
