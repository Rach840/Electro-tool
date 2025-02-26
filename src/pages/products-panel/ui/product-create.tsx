"use client"

import React, { useEffect } from "react";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Input } from "@/src/shared/ui/input"
import { Label } from "@/src/shared/ui/label"
import { Button } from "@/src/shared/ui/button"
import { Textarea } from "@/src/shared/ui/textarea"
import { toast } from "@/src/shared/ui/use-toast"
import MultipleSelector, { Option } from '@/src/shared/ui/multiple-selector';
import type { Product } from "@/src/db/schema";
import { InputImage } from "@/src/shared/ui/input-image";
import { v4 as uuidv4 } from "uuid";
export default function CreateProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
const productId =uuidv4()
  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);
  const OPTIONS:Option[] = products?.map((item: Product) =>{
    return {
      label:item.category,
      value:item.category,
    }
  });

    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
    })
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProduct((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (URL:string) => {
        if (URL) {
            setImage(URL)
            setImagePreview(URL)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the data to your backend API
        console.log("Submitting product:", { ...product, image })
      fetch(`/api/products/admin/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([productId,product,image ]),
      });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Создание нового продукта</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Название продукта</Label>
                                <Input id="name" name="name" value={product.name} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Стоимость</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={product.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Категория</Label>
                              {products.length  ? (
                                <MultipleSelector
                                  defaultOptions={OPTIONS}
                                  placeholder="Выберите существующюю категорию или создайте новую"
                                  creatable
                                  onChange={(e)=>  setProduct((prev) => ({ ...prev, category: e[0].value }))}
                                  emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                      Никаких категорий нету.
                                    </p>
                                  }
                                />

                              ) : ''}

                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Наличие</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={product.stock}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={product.description}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Картинка продукта</Label>
                            <InputImage productId={productId} onChange={(url)=> handleImageChange(url)} />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview || "/placeholder.svg"} alt="Product preview" className="max-w-xs rounded-md" />
                                </div>
                            )}
                        </div>
                        <Button type="submit" className="bg-[#FFB800] hover:bg-[#E5A600] text-black">
                            Создать продукт
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

