"use client";

import { useEffect, useState } from "react";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Checkbox } from "@/src/shared/ui/checkbox";
import ProductCard from "@/src/shared/ui/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import { Separator } from "@/src/shared/ui/separator";
import type { Product } from "@/src/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);
  const allCategories = products?.map((item: Product) => item.category);
  const categories = Array.from(new Set([...allCategories]));

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.category)),
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className=" space-y-4  p-2 md:col-span-1">
        <CardHeader className=" pb-0 text-xl font-bold ">
          <CardTitle className="text-lg font-semibold mb-4">Фильтры</CardTitle>

          <div>
            <Label htmlFor="search">Поиск</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию"
            />
          </div>
        </CardHeader>
        <Separator className="" />
        <CardContent className="space-y-4">
          <Label>Категории</Label>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  setSelectedCategories((prev) =>
                    checked
                      ? [...prev, category]
                      : prev.filter((c) => c !== category),
                  );
                }}
              />
              <Label htmlFor={category}>{category}</Label>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="md:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Продукты</h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировать как" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">По названию</SelectItem>
              <SelectItem value="price-asc">
                Цена: От низких к высоким
              </SelectItem>
              <SelectItem value="price-desc">
                Цена: От высоких к низким
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
