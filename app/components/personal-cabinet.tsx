"use client"

import { useAuth } from "../contexts/auth-context"
import { withRoleAccess } from "./with-role-access"
import { useState, useEffect } from "react"
import type { Order } from '@/src/db/schema'

function PersonalCabinet() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user?.role === "CLIENT") {
      async function fetchOrders() {
        const response = await fetch(`/api/users/${user.id}/orders`)
        const data = await response.json()
        setOrders(data)
      }
      fetchOrders()
    }
  }, [user])

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Personal Cabinet</h2>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.role}</p>
      {user?.role === "CLIENT" && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Your Orders</h3>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="border-b py-2">
                  <p>Order ID: {order.id}</p>
                  <p>Total: ${order.total}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default withRoleAccess(PersonalCabinet, ["CLIENT", "SALES_MANAGER", "CEO"])

