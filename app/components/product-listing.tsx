"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import type { Product }from '@/src/db/schema'

export default function ProductListing() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<{ id: string; name: string; price: number }[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart([...cart, product])
  }

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
                onClick={() => addToCart(product)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
      {user?.role === "CLIENT" && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Your Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b py-2">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

