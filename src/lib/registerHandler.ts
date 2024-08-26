'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const handleRegister = async (formData: FormData) => {
    const username = formData.get("username");
    const imageUrl = formData.get("imageUrl");
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, imageUrl, email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
        if (json.error === "Invalid email or password") {
            return { error: "Invalid email or password" }
        } else {
            return { error: "Internal server error" }
        }
    }

    const maxAge = 60 * 60 * 24 * 7
    cookies().set("token", json.token, {
        secure: true,
        httpOnly: true,
        path: '/',
        expires: new Date(Date.now() + maxAge * 1000),
    });

    redirect("/profile");
};

export default handleRegister;
