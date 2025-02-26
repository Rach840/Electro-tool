'use client'
import Layout from "@/src/app/layouts/layout";
import { Carousel,CarouselContent, CarouselItem, CarouselPrevious,CarouselNext } from "@/src/shared/ui/carousel";
import { useEffect, useState } from "react";
import type { Product } from "@/src/db/schema";
import ProductCard from "@/src/shared/ui/product-card";
import { Button } from "@/src/shared/ui/button";
import Link from "next/link";


export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);
  return (
    <Layout>
      <div className=" space-y-8">
        <Carousel className="w-8/12  mx-auto">
          <CarouselContent>

            <CarouselItem className='relative'>
              <img src="../../main.jpg" className="w-full h-96" alt="" />
              <div className="p-1">
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-50 text-white p-4">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">У нас новые товары!</h2>
                  <p className="text-sm md:text-lg mb-4">Новые товары уже доступны в каталоге</p>
                  <Button asChild className="bg-[#FFB800] hover:bg-[#E5A600] text-black">
                    <Link href="/products">Смотреть продукты</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className='relative'>
              <img src="../../main2.png" className=" w-full h-96" alt="" />
              <div className="p-1">
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-50 text-white p-4">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">Скоро скидки!</h2>
                  <p className="text-sm md:text-lg mb-4">Скоро весенние скидки</p>
                  <Button asChild className="bg-[#FFB800] hover:bg-[#E5A600] text-black">
                    <Link href="/products">Смотреть продукты</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>

          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <section>
          <h2 className="text-2xl font-bold mb-4"> Товары</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}
