"use client";

import Link from "next/link";
import { useAuth } from "./auth-context";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ElectroTools
        </Link>
        <div className="space-x-4">
          <Link href="/products" className="text-black text-lg hover:text-gray-600">
            Продукты
          </Link>
          {user ? (
            <>
              <Link
                href="/cabinet"
                className="text-black text-lg hover:text-gray-600"
              >
                Профиль
              </Link>
              {user.role === "CEO" || user.role === "SALES_MANAGER" ? (
                <Link
                  href="/buy-carts"
                  className="text-black text-lg hover:text-gray-600"
                >
                  Заказы пользователей
                </Link>
              ) : user.role === "CEO" || user.role === "STORAGE_MANAGER" ? (
                  <Link
                      href="/products/admin"
                      className="text-black text-lg hover:text-gray-600"
                  >
                    Управление продуктами
                  </Link>
              ) : (
              <>  <Link
                  href="/cart"
                  className="text-black text-lg hover:text-gray-600"
                >
                  Корзина
                </Link>
                <Link
                href="/support"
                className="text-black text-lg hover:text-gray-600"
                >
                Поддержка
                </Link></>
              )}
              <button
                onClick={logout}
                className="text-black text-lg hover:text-gray-600"
              >
                Выйти
              </button>

            </>
          ) : (
            <>
              <Link href="/login" className="text-black text-lg hover:text-gray-600">
                Войти
              </Link>
              <Link
                href="/register"
                className="text-black text-lg hover:text-gray-600"
              >
                Зарегистрироваться
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
