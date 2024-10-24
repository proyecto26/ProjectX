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
    <Layout title="ProjectX" className="bg-gradient-to-b from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800">
      <LoginPage />
    </Layout>
  );
}