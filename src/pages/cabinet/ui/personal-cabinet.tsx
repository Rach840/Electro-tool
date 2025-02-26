"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs";
import { Separator } from "@/src/shared/ui/separator";
import {
  Package,
  MapPin,
  Settings,
  CreditCard,
  AlertCircle,
  RussianRuble,
  Frown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/avatar";
import { useAuth } from "@/src/app/layouts";
import { Alert, AlertDescription, AlertTitle } from "@/src/shared/ui/alert";
import DeliverBadge from "@/src/shared/ui/badge-deliver";
import CabinetSkeleton from "@/src/pages/cabinet/ui/cabinet-skeleton";
import {
  UserProfileFormData,
  userSchema,
} from "@/src/pages/cabinet/models/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changeInfo } from "@/src/pages/cabinet/api/changeInfo";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogContent,
} from "@/src/shared/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/ui/dialog";
import {
  approveDeliver,
  deniedDeliver,
} from "@/src/pages/cabinet/api/changeStatus";
import { updateAddress } from "../api/changeAddress";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState();
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [orderTotal, setOrderTotal] = useState();
  const [address, setAddress] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/orders/get-order/${user?.id}/orders`);
      const data = await response.json();
      const ordersTotal = data.reduce(
        (total, orders) => total + orders.orderTotal,
        0,
      );
      setOrderTotal(ordersTotal);
      setOrders(data);
      setAddress(user.address || "");
      if (user && Array.isArray(data)) setIsLoading(false);
    })();
  }, [user]);

  const {
    register,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user.name,
      lastName: "" || user.lastName,
      email: "" || user.email,
      phone: "" || user.phone,
    },
  });

  const [message, formChangeAction] = useActionState(changeInfo, null);
  function changeReRenderDeliver(variant, orderId) {
    const newOrders = orders.splice(0);
    newOrders.forEach(
      (order) => (order.status = order.id == orderId ? variant : order.status),
    );
    if (variant == "DELIVERED") {
      approveDeliver(orderId);
    } else {
      deniedDeliver(orderId);
    }

    setOrders(newOrders);
  }

  function getDate(str) {
    const date = new Date(str);
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return date.toLocaleString("ru", options);
  }
  if (isLoading) {
    return <CabinetSkeleton />;
  } else {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Sidebar with user info */}
          <aside className="w-full md:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Всего заказов
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {orders.length ? orders.length : "Пока что нету"}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Товаров куплено на{" "}
                      </CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {orderTotal ? orderTotal + "₽" : "Пока что нету"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <AlertDialog
              open={isChangeDialogOpen}
              onOpenChange={setIsChangeDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {"Ваш профиль успешно изменён!" || message}
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Продолжить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList>
                <TabsTrigger className="text-lg" value="personal">
                  Персональная информация
                </TabsTrigger>
                <TabsTrigger className="text-lg" value="orders">
                  Заказы
                </TabsTrigger>
                <TabsTrigger className="text-lg" value="addresses">
                  Адресы
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Персональная информация</CardTitle>
                    <Button
                      variant="outline"
                      className="bg mt-4 bg-[#FFB800] hover:bg-[#E5A600] text-lg"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      Изменить
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form action={formChangeAction}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Имя</Label>
                          <Input
                            id="firstName"
                            readOnly={!isEditing}
                            defaultValue={user.name}
                            {...register("firstName")}
                          />
                          {errors.firstName && (
                            <p className="text-red-500">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Фамилия</Label>
                          <Input
                            id="lastName"
                            readOnly={!isEditing}
                            defaultValue={user.lastName}
                            {...register("lastName")}
                          />
                          {errors.lastName && (
                            <p className="text-red-500">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Электронная почта</Label>
                          <Input
                            id="email"
                            readOnly={!isEditing}
                            defaultValue={user.email}
                            type="email"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-red-500">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Номер телефона</Label>
                          <Input
                            id="phone"
                            readOnly={!isEditing}
                            defaultValue={user.phone}
                            type="tel"
                            {...register("phone")}
                          />
                          {errors.phone && (
                            <p className="text-red-500">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        {isEditing && (
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline">
                              Закрыть
                            </Button>
                            <Button
                              type="submit"
                              onClick={() => setIsChangeDialogOpen(true)}
                              className="bg-[#FFB800] hover:bg-[#E5A600] text-black"
                            >
                              Сохранить изменения
                            </Button>
                          </div>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Заказы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.length >= 1 ?  orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">
                                Заказ #{order.id.slice(0, 5)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Заказ от {getDate(order.createdAt)}
                              </p>
                            </div>
                            <DeliverBadge status={order.status} />
                          </div>
                          <div className="flex items-center gap-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {order.orderItems[0].name} +{" "}
                                {order.orderItems.length - 1} других товара
                              </p>
                              <p className="text-sm text-muted-foreground ">
                                Сумма заказа: {order.total}
                                <RussianRuble className="size-4 inline" />
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Подробнее
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl">
                                    Заказ #{order.id.slice(0, 5)}
                                  </DialogTitle>
                                  <DialogDescription className="text-lg">
                                    Заказ от {getDate(order.createdAt)}
                                  </DialogDescription>
                                  <DeliverBadge status={order.status} />
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  {order.orderItems.map((orderItem) => (
                                    <div
                                      key={orderItem.id}
                                      className="flex items-center justify-between border-b pb-4"
                                    >
                                      <div className="flex items-center space-x-4">
                                        <img
                                          src={`/placeholder.svg?height=80&width=80&text=${orderItem.name}`}
                                          alt={orderItem.name}
                                          className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                          <h3 className="font-semibold">
                                            {orderItem.name}
                                          </h3>
                                          <p className="text-gray-600">
                                            {orderItem.price.toFixed(2)}₽
                                          </p>
                                        </div>
                                      </div>
                                      <h3 className="font-semibold">
                                        {orderItem.quantity} шт
                                      </h3>
                                    </div>
                                  ))}
                                </div>
                                <DialogFooter>
                                  {order.status === "PROCESSED" ? (
                                    <div className="flex w-full items-center justify-between">
                                      <p className="font-semibold">
                                        Вам пришел заказ?
                                      </p>
                                      <div className="space-x-2">
                                        <Button
                                          onClick={() =>
                                            changeReRenderDeliver(
                                              "DELIVERED",
                                              order.id,
                                            )
                                          }
                                        >
                                          Да
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() =>
                                            changeReRenderDeliver(
                                              "FAILED",
                                              order.id,
                                            )
                                          }
                                        >
                                          Нет
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )) : (
                        <div className="flex items-center justify-center py-10 space-x-2">
                          <p className="text-2xl font-bold align-center ">Пока что нету</p> <Frown />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle>Адресы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      {user?.address ? (
                        <>
                          <Card>
                            <CardContent className="pt-6 justify-between flex">
                              <p className="text-sm mt-2">
                                {user?.address.slice(0, 20)}...
                              </p>
                              <div className="flex justify-between items-start mb-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setIsAddressDialogOpen(true);
                                    console.log(isAddressDialogOpen);
                                  }}
                                >
                                  <Settings className="h-6 w-6" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Пусто!</AlertTitle>
                          <AlertDescription>
                            Вы не добавили не одного адресса
                          </AlertDescription>
                        </Alert>
                      )}
                      {!user?.address ? (
                        <Button
                          variant="outline"
                          className="h-full min-h-[120px] flex flex-col gap-2"
                          onClick={() => setIsAddressDialogOpen(true)}
                        >
                          <MapPin className="h-8 w-8" />
                          Добавить новый адрес
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
                    <Dialog
                      open={isAddressDialogOpen}
                      onOpenChange={setIsAddressDialogOpen}
                    >
                      <DialogTrigger asChild></DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            Добавить адрес получателя
                          </DialogTitle>
                          <DialogDescription className="text-lg">
                            Добавьте адрес чтобы оформить заказ
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Введите ваш адрес</Label>
                            <Input
                              id="address"
                              required
                              defaultValue={user.address ? user.address : ""}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="submit"
                            onClick={() => {
                              if (address.length > 5) {
                                updateAddress(user.id, address);
                                setIsAddressDialogOpen(false);
                                setIsChangeDialogOpen(true);
                              }
                            }}
                            className="bg-[#FFB800] hover:bg-[#E5A600] text-black"
                          >
                            Применить изменения
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    );
  }
}
