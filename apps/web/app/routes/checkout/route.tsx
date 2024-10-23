
import { Layout } from "@projectx/ui";
import { Outlet } from "@remix-run/react";

export default function Route() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}