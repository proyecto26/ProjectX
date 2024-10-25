import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import OrderSummary from "~/pages/OrderSummary";
import { getAccessTokenOrRedirect } from "~/cookies/auth.server";
import PageLayout from "~/pages/PageLayout";

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
    <PageLayout title="ProjectX">
      <OrderSummary />
    </PageLayout>
  );
}