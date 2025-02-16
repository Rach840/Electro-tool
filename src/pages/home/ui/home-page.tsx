import Layout from "@/src/app/layouts/layout";
import ProductListing from "./product-listing";

export function HomePage() {
    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">Welcome to ElectroTools</h1>
            <ProductListing />
        </Layout>
    );
}
