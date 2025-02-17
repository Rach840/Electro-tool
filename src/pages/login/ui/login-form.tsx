"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/app/layouts";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            router.push("/cabinet");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6"
        >
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="mb-4">
                <label
                    htmlFor="email"
                    className="block text-gray-700 font-bold mb-2"
                >
                    Электронная почтв
                </label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-gray-700 font-bold mb-2"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Login
            </button>
            <p className="mt-4 text-center">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="text-blue-500 hover:underline"
                >
                    Register here
                </Link>
            </p>
        </form>
    );
}
