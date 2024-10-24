import { Layout } from "@projectx/ui";
import type { MetaFunction } from "@remix-run/node";
import { AdminPage } from "~/pages/Admin";

export const meta: MetaFunction = () => {
  return [
    { title: "Marketplace - Your E-commerce Store" },
    { name: "description", content: "Browse our wide selection of products in our online marketplace." },
  ];
};

export default function Index() {
  return (
    <Layout title="ProjectX">
      <AdminPage />
    </Layout>
  );
}