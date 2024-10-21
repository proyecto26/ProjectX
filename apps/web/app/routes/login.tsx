import { Layout } from "@projectx/ui";
import type { MetaFunction } from "@remix-run/node";

import { LoginPage } from "~/pages/LoginPage";

export const meta: MetaFunction = () => {
  return [
    { title: "Marketplace - Your E-commerce Store" },
    { name: "description", content: "Browse our wide selection of products in our online marketplace." },
  ];
};

export default function Index() {
  return (
    <Layout title="Login">
      <LoginPage />
    </Layout>
  );
}