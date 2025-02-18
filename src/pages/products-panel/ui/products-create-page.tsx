import Layout from "@/src/app/layouts/layout";
import ProductsAdminPage from "./products-panel";
import CreateProductPage from "@/src/pages/products-panel/ui/product-create";

export function ProductsCreatePage() {
    return (
        <Layout>
            <CreateProductPage />
        </Layout>
    );
}
