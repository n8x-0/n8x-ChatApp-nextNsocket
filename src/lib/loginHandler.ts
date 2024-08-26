'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const handleLogin = async (formData: FormData) => {

    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const json = await res.json();

    if (!res.ok) {
        if (json.error === "Wrong credentials") {
            return { error: "Wrong credentials" }
        } else if (json.error === "Something went wrong") {
            return { error: "Something went wrong" }
        } else {
            return { error: "Please create an account" }
        }
    }

    const maxAge = 60 * 60 * 24 * 7
    cookies().set("token", json.token, {
        secure: true,
        httpOnly: true,
        path: '/',
        expires: new Date(Date.now() + maxAge * 1000),
    })

    redirect("/profile")
}

export default handleLogin;
