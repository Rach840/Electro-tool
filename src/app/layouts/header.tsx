"use client";

import Link from "next/link";
import { useAuth } from "./auth-context";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    ElectroTools
                </Link>
                <div className="space-x-4">
                    <Link
                        href="/products"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Продукты
                    </Link>
                    {user ? (
                        <>
                            <Link
                                href="/cabinet"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Профиль
                            </Link>
                            {user.role === "CEO" ||
                            user.role === "SALES_MANAGER" ? (
                                <Link
                                    href="/buy-carts"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Заказы пользователей
                                </Link>
                            ) : (
                                <Link
                                    href="/cart"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Корзина
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Войти
                            </Link>
                            <Link
                                href="/register"
                                className="text-gray-600 hover:text-gray-900"
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
