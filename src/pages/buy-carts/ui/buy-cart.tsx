"use client";

import { useState, useEffect } from "react";
import { withRoleAccess } from "@/src/app/with-role-access";
import type { Order } from "@/src/db/schema";

function BuyCart() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        async function fetchOrders() {
            const response = await fetch("/api/orders");
            const data = await response.json();
            setOrders(data);
        }
        fetchOrders();
    }, []);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Buy Carts</h2>
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">ID</th>
                        <th className="text-left py-2">Client</th>
                        <th className="text-left py-2">Total</th>
                        <th className="text-left py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                            <td className="py-2">{order.id}</td>
                            <td className="py-2">{order.userId}</td>
                            <td className="py-2">${order.total}</td>
                            <td className="py-2">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default withRoleAccess(BuyCart, ["SALES_MANAGER", "CEO"]);
