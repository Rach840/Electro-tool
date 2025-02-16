import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { carts, users } from "@/src/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    const { name, username, password } = await request.json();

    try {
        // Check if username already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.username, username));

        if (existingUser.length) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 400 },
            );
        }

        // Create new user
        const id = uuidv4();
        const hashedPassword = bcrypt.hashSync(password, 10);
        await db
            .insert(users)
            .values({
                id: id,
                name,
                username,
                password: hashedPassword,
                role: "CLIENT", // Default role for new registrations
            })
            .$returningId();
        await db.insert(carts).values({
            id: uuidv4(),
            userId: id,
        });
        const newUser = await db
            .select()
            .from(users)
            .where(eq(users.username, username));

        const { password: _, ...userWithoutPassword } = newUser[0];
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 },
        );
    }
}
