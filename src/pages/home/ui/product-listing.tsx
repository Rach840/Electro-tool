"use client";

import { useState, useEffect } from "react";

import type { Product } from "@/src/db/schema";

import { useAuth } from "@/src/app/layouts";
import { Button } from "@/src/shared/ui/button";

export default function ProductListing() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<
    { id: string; name: string; price: number }[]
  >([]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            {user?.role === "CLIENT" && (
              <button
                onClick={() => (user ? addToCart(product) : alert("Error"))}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Добавить в корзину
              </button>
            )}
          </div>
        ))}
      </div>
      {user?.role === "CLIENT" && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Твоя корзина </h3>
          {cart.length === 0 ? (
            <p>Корзина пустая</p>
          ) : (
            <>
              <ul>
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
              <Button>Оформить заказ</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
