import Layout from "./components/layout"
import ProductListing from "./components/product-listing"

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Welcome to ElectroTools</h1>
      <ProductListing />
    </Layout>
  )
}

