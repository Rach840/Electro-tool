"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Input } from "@/src/shared/ui/input"
import { Label } from "@/src/shared/ui/label"
import { Button } from "@/src/shared/ui/button"
import { Textarea } from "@/src/shared/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"
import { toast } from "@/src/shared/ui/use-toast"

export default function CreateProductPage() {
    const router = useRouter()
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the data to your backend API
        console.log("Submitting product:", { ...product, image })
        toast({
            title: "Product Created",
            description: "Your new product has been successfully added.",
        })
        router.push("/products/admin")
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
                                <Select
                                    value={product.category}
                                    onValueChange={(value) => setProduct((prev) => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Power Tools">Power Tools</SelectItem>
                                        <SelectItem value="Hand Tools">Hand Tools</SelectItem>
                                        <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
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

