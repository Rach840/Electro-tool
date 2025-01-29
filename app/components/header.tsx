"use client"

import Link from "next/link"
import { useAuth } from "../contexts/auth-context"

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          ElectroTools
        </Link>
        <div className="space-x-4">
          <Link href="/products" className="text-gray-600 hover:text-gray-900">
            Products
          </Link>
          {user ? (
            <>
              <Link href="/cabinet" className="text-gray-600 hover:text-gray-900">
                Personal Cabinet
              </Link>
              {(user.role === "CEO" || user.role === "SALES_MANAGER") && (
                <Link href="/buy-carts" className="text-gray-600 hover:text-gray-900">
                  Buy Carts
                </Link>
              )}
              <button onClick={logout} className="text-gray-600 hover:text-gray-900">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-900">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

