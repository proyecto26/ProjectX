import { Layout } from "@projectx/ui";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { OrderHistory } from "~/pages/OrderHistory";
import { getAccessTokenOrRedirect } from "~/cookies/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Marketplace - Your E-commerce Store" },
    { name: "description", content: "Browse our wide selection of products in our online marketplace." },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await getAccessTokenOrRedirect(request);
};

export default function Index() {
  return (
    <Layout title="ProjectX">
      <OrderHistory />
    </Layout>
  );
}