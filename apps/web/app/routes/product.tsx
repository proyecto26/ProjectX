import type { MetaFunction } from "@remix-run/node";
import { ProductDetail } from "~/pages/ProductDetail";
import PageLayout from "~/pages/PageLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Marketplace - Your E-commerce Store" },
    { name: "description", content: "Browse our wide selection of products in our online marketplace." },
  ];
};

export default function Index() {
  return (
    <PageLayout title="ProjectX">
      <ProductDetail />
    </PageLayout>
  );
}