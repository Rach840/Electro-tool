"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Button } from "@/src/shared/ui/button"
import { Badge } from "@/src/shared/ui/badge"
import { Separator } from "@/src/shared/ui/separator"
import {
  ArrowLeft,
  Package,
  Edit,
  Trash2,
  AlertTriangle,
  RussianRuble,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/ui/dialog"
import { toast } from "@/src/shared/ui/use-toast"
import { deleteProduct, getProduct } from "@/src/pages/products-panel/api/product";
import { Product } from "@/src/db/schema";
import CreatePropertyDocument from "@/src/shared/ui/PropertyCardPDF";
import { Label } from "@/src/shared/ui/label";
import { Input } from "@/src/shared/ui/input";
import { Textarea } from "@/src/shared/ui/textarea";
import { updateProduct } from "@/src/pages/products-panel/api/update-product";

// Mock data




export default function ProductDetails() {

  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<Product>()
  const [saled, setSaled] = useState()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    (async ()=> {
      const [product, productSaled] = await getProduct(params.id);
      setProduct(product)
      setSaled(productSaled)
      setIsLoading(false)
    })()
  }, [])

  const handleDelete = () => {
    deleteProduct(params.id)
    router.push("/products/admin")
  }
  const [editingProduct, setEditingProduct] = useState<null | {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    description: string;
    manufacturer: string;
  }>(null);
  const handleUpdateProduct = () => {
    if (editingProduct) {
      console.log("editing product", editingProduct);
      updateProduct(editingProduct)
      const newProject = {
        id: editingProduct.id,   name: editingProduct.name,   price:editingProduct.price,   category:editingProduct.category,   stock:editingProduct.stock,   description: editingProduct.description,   manufacturer: editingProduct.manufacturer,
        createdAt: product.createdAt,
        image:product.image,

      }
      setProduct(newProject);
      setEditingProduct(null);
    }
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/3 bg-muted rounded" />
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Назад
        </Button>
        <div className="space-x-2">
          <Dialog >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#FFB800] hover:bg-[#E5A600] text-black"
                onClick={() => setEditingProduct(product)}
              >
                <Edit className="mr-2 h-4 w-4" /> Редактировать
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

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Удалить продукт
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Удалить продукт</DialogTitle>
                <DialogDescription>
                  Вы точно хотите удалить продукт?
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-md">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">
                  Удаленёный товар не получится восстановить
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Закрыть
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Удалить продукт
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className='text-xl'>{product.name}</CardTitle>
                <p className="text-lg text-muted-foreground mt-1">Артикул: {product.id}</p>
              </div>
              <Badge className='text-lg' variant={product.stock > 20 ? "outline" : "destructive"}>Наличие: {product.stock}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={product.image ? product.image : '/placeholder.svg"'}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl mb-2">Подробнее о продукте</h3>
                  <p className="text-lg mb-2">Цена: {product.price}₽ </p>
                  <p className="text-lg ">{product.description}</p>
                </div>
                <Separator />
                <div>

                  <dl className="grid grid-cols-1 gap-2 text-sm">

                      <div className="flex text-lg justify-between">
                        <dt className="text-muted-foreground  capitalize">Категория:</dt>
                        <dd className="font-medium">{product.category}</dd>

                      </div>
                    <div className="flex text-lg justify-between">
                      <dt className="text-muted-foreground capitalize">Производитель:</dt>
                      <dd className="font-medium">{product.manufacturer}</dd>

                    </div>
                    <div className="flex text-lg justify-between">
                      <dt className="text-muted-foreground capitalize">Цена:</dt>
                      <dd className="font-medium">{product.price}₽</dd>

                    </div>
                  </dl>
                </div>

                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Всего продано</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{saled}</div>

                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Всего продано на </CardTitle>
                      <RussianRuble className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{product.price * saled}₽ </div>
                    </CardContent>
                  </Card>
                  <CreatePropertyDocument product={product}/>
                </div>

              </div>
            </div>

          </CardContent>
        </Card>





      </div>
    </div>
  )
}

