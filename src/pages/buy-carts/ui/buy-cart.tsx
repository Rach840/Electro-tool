"use client";

import { useState, useEffect } from "react";
import type { Order } from "@/src/db/schema";
import { OrderSkeleton } from "@/src/shared/ui/skeletons";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/ui/table";
import { Button } from "@/src/shared/ui/button";
import { useAuth } from "@/src/app/layouts";
import { useRouter } from "next/navigation";
import BadgeDeliver from "@/src/shared/ui/badge-deliver";

export default function BuyCart() {
  const [orders, setOrders] = useState<Order[]>();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data);
      if (user && Array.isArray(data)) setIsLoading(false);
    }
    fetchOrders();
  }, [user]);

  if (!isLoading && !(user.role == "SALES_MANAGER")) router.replace("/");

  const filteredOrders = orders?.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" ||
        order.status.toLowerCase() === statusFilter.toLowerCase()),
  );
console.log(filteredOrders);
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Заказы пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Найти заказ</Label>
              <Input
                id="search"
                placeholder="Найти заказ по id заказа или имени пользователя"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Фильтровать по статусу</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="DELIVERED">Доставлено</SelectItem>
                  <SelectItem value="PROCESSED">В пути</SelectItem>
                  <SelectItem value="FAILED">Не доставлено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID пользователя</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Подробнее</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>
                      {order.user?.name ?order.user.name : 'Удаленный аккаунт' } {order.user?.lastName ? order.user.lastName : 'Удаленный аккаунт'}
                    </TableCell>
                    <TableCell>{order.total.toFixed(2)}₽</TableCell>
                    <TableCell>
                      <BadgeDeliver status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline">
                        <Link href={`/buy-carts/${order.id}`}>Подробнее</Link>
                      </Button>
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
