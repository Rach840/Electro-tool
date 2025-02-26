"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { useAuth } from "@/src/app/layouts";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  description: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddToCartDialogOpen, setIsAddToCartDialogOpen] = useState(false);
  const addToCart = () => {
    fetch(`/api/cart/set-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([user.id, product]),
    });
    setIsAddToCartDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={product.image ? product.image : `/placeholder.svg?height=200&width=200&text=${product.name}`}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <Badge className="mb-4">{product.category}</Badge>
        <p className="text-md font-bold">{product.description.slice(0,90)}...</p>
        <p className="text-lg font-bold">{product.price.toFixed(2)}₽</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Подробнее</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
            </DialogHeader>
            <img
              src={product.image ? product.image : `/placeholder.svg?height=300&width=300&text=${product.name}`}
              alt={product.name}
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <DialogDescription>{product.category}</DialogDescription>
            <p className="text-lg font-bold mb-4">{product.description}</p>

            <p className="text-lg font-bold mb-4">
              {product.price.toFixed(2)} ₽
            </p>
            <Button className='bg-[#FFB800] text-black hover:bg-[#E5A600]'  onClick={addToCart}>Добавить в корзину</Button>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isAddToCartDialogOpen}
          onOpenChange={setIsAddToCartDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{product.name} добавлен в корзину!</DialogTitle>
              <DialogDescription>Можете посмотреть корзину</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Button className='bg-[#FFB800] hover:bg-[#E5A600] text-black' onClick={addToCart}>Добавить в корзину</Button>
      </CardFooter>
    </Card>
  );
}