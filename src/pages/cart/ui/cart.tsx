"use client";

import { useEffect, useState } from "react";

import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/src/shared/ui/sheet";
import { useMediaQuery } from "@/src/shared/hooks/use-media-query";
import { useAuth } from "@/src/app/layouts";

export default function Cart() {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch(`/api/cart/get-cart/${user.id}/cart`);
            const data = await response.json();
            setCart(data);
        }
        fetchProducts();
    }, [user]);

    const isMobile = useMediaQuery("(max-width: 640px)");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    function updateQuantity(id, variant: string): void {
        const cartItemQuantity = cart.find((item) => item.orderItem.id == id);

        cartItemQuantity.orderItem.quantity =
            variant == "plus"
                ? cartItemQuantity.orderItem.quantity + 1
                : cartItemQuantity.orderItem.quantity - 1;

        fetch(`/api/cart/change-cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([id, cartItemQuantity.orderItem.quantity]),
        });

        const cartNew = cart.slice(0);

        cart.forEach((item) => {
            item.orderItem.id == item.id
                ? item.orderItem.quantity == cartItemQuantity.orderItem.quantity
                : false;
        });
        setCart(cartNew);
    }

    function deleteCart(id: string) {
        fetch(`/api/cart/delete-cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id),
        });
        const cartItemIndex = cart.findIndex(
            (item, index) => item.orderItem.id == id,
        );
        let cartNew = cart.splice(0);
        cartNew.splice(cartItemIndex, 1);
        setCart(cartNew);
    }
    function createOrder() {
        const cartItemsId = cart.map((item) => item.orderItem.id);
        const cartProductsId = cart.map((item) => item.product.id);
        fetch(`/api/orders/set-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([user.id, cartProductsId, cartItemsId]),
        });
    }
    const total = cart.reduce(
        (sum, item) => sum + item.product.price * item.orderItem.quantity,
        0,
    );

    const CartContent = () => (
        <div className="space-y-4">
            {cart.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4"
                >
                    <div className="flex items-center space-x-4">
                        <img
                            src={`/placeholder.svg?height=80&width=80&text=${item.product.name}`}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                            <h3 className="font-semibold">
                                {item.product.name}
                            </h3>
                            <p className="text-gray-600">
                                ${item.product.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={(e) =>
                                    updateQuantity(item.orderItem.id, "minus")
                                }
                                disabled={item.orderItem.quantity <= 1}
                            >
                                <Minus />
                                <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="flex-1 text-center">
                                <div className="text-xl font-bold tracking-tighter">
                                    {item.orderItem.quantity}
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={(e) =>
                                    updateQuantity(item.orderItem.id, "plus")
                                }
                                disabled={item.orderItem.quantity >= 10}
                            >
                                <Plus />
                                <span className="sr-only">Increase</span>
                            </Button>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => deleteCart(item.orderItem.id)}
                            size="icon"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
            <div className="flex justify-between items-center pt-4">
                <p className="text-xl font-semibold">Total:</p>
                <p className="text-xl font-bold">${total.toFixed(2)}</p>
            </div>
            <Button onClick={createOrder} className="w-full">
                Proceed to Checkout
            </Button>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Ваша корзина</h1>
            {cart.length === 0 ? (
                <p>Ваша корзина пуста.</p>
            ) : isMobile ? (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button>View Cart</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Ваша корзина</SheetTitle>
                            <SheetDescription>
                                Посмотрите что вы добавили в корзину
                            </SheetDescription>
                        </SheetHeader>
                        <CartContent />
                    </SheetContent>
                </Sheet>
            ) : (
                <CartContent />
            )}
        </div>
    );
}
