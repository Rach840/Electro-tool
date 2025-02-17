import Layout from "@/src/app/layouts/layout";
import Cart from "./cart";

export function CartPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Welcome to ElectroTools</h1>
      <Cart />
    </Layout>
  );
}
