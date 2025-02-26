"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Button } from "@/src/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/ui/table";
import { Badge } from "@/src/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/ui/dialog";
import { ProductGridSkeleton } from "@/src/shared/ui/skeletons";
import {useRouter} from "next/navigation";
import {useAuth} from "@/src/app/layouts";
import {updateProduct} from "@/src/pages/products-panel/api/update-product";
import { Textarea } from "@/src/shared/ui/textarea";
import {Product} from "@/src/db/schema";
import ExportButton from "@/src/shared/ui/export-button";

export default function ProductsAdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<null | {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    description: string;
    manufacturer: string;
  }>(null);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products/admin");
      const data = await response.json();
      if (user && Array.isArray(data)) setIsLoading(false);
      setProducts(data);
    }
    fetchProducts();
  }, [user]);
  if (!isLoading && !(user.role == "STORAGE_MANAGER")) router.replace("/");
  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );


  const handleUpdateProduct = () => {
    if (editingProduct) {
      console.log("editing product", editingProduct);
      updateProduct(editingProduct)
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
      );
      setEditingProduct(null);
    }
  };
const productRussia = products?.map((item) => {
  return {
    Артикул: item.id ,
    Название: item.name ,
    Создан:item.createdAt ,
    Описание: item.description ,
    Цена: item.price ,
    Категория: item.category ,
    Наличие: item.stock ,
    Производитель: item.manufacturer ,
  }
})
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Продукты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">

            <div className="w-1/3">
              <Label htmlFor="search">Найти продукты</Label>
              <Input
                id="search"
                placeholder="Найти по наименованию или категории"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className=" flex space-x-8 items-center">
            <ExportButton response={productRussia}/>
            <Button
              asChild
              className="bg-[#FFB800] hover:bg-[#E5A600] text-black"
            >
              <Link href="/products/admin/create">Создать новый продукт</Link>
            </Button>
            </div>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={5} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Наименование</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Наличие</TableHead>
                  <TableHead>Завод производитель</TableHead>
                  <TableHead>Изменения</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toFixed(2)}₽</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.stock > 20 ? "outline" : "destructive"}
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.manufacturer}</TableCell>
                    <TableCell className='space-x-2'>
                      <Button variant="outline" asChild>
                        <Link href={`/products/admin/${product.id}`}>Подробнее</Link>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            Изменить
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Изменение продукта</DialogTitle>
                            <DialogDescription>

                            </DialogDescription>
                          </DialogHeader>
                          {editingProduct && (
                            <form className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-name"
                                  className="text-right"
                                >
                                  Наименование
                                </Label>
                                <Input
                                  id="edit-name"
                                  defaultValue={editingProduct.name}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      name: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-price"
                                  className="text-right"
                                >
                                  Цена
                                </Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  defaultValue={editingProduct.price}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      price: Number.parseFloat(e.target.value),
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-category"
                                  className="text-right"
                                >
                                  Категория
                                </Label>
                                <Input
                                  id="edit-category"
                                  defaultValue={editingProduct.category}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      category: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-stock"
                                  className="text-right"
                                >
                                  Наличие
                                </Label>
                                <Input
                                  id="edit-stock"
                                  type="number"
                                  defaultValue={editingProduct.stock}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      stock: Number.parseInt(e.target.value),
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-description"
                                    className="text-right"
                                >
                                  Описание
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    defaultValue={editingProduct.description}
                                    onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          description: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-manufacturer"
                                    className="text-right"
                                >
                                  Завод производитель
                                </Label>
                                <Input
                                    id="edit-manufacturer"
                                    type="text"
                                    defaultValue={editingProduct.manufacturer}
                                    onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          manufacturer: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                              </div>
                            </form>
                          )}
                          <DialogFooter>
                            <Button
                              className="bg-[#FFB800] hover:bg-[#E5A600] text-black"
                              onClick={handleUpdateProduct}
                            >
                              Изменить продукт
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
