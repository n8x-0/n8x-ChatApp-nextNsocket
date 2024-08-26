import bcrypt from "bcrypt";
import { mongoDBconnection } from "@/DB/connection/connection";
import {User} from "@/DB/models/userModel";
import { cookies } from "next/headers";
import * as jose from 'jose';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    try {
        await mongoDBconnection();
        let user = await User.findOne({ email })
        let correctPass = bcrypt.compareSync(password, user.password);

        if (!user || !correctPass) {
            return NextResponse.json(
                { error: 'Wrong credentials' },
                { status: 500 }
            )
        }

        const cookie = cookies().get("token");
        if (!cookie || cookie.value === '') {
            const secret = new TextEncoder().encode(process.env.JWT_TOKEN,)
            const alg = 'HS256'
            const token = await new jose.SignJWT({})
                .setProtectedHeader({ alg })
                .setSubject(user._id.toString())
                .sign(secret)
            return NextResponse.json(
                {
                    user: user,
                    token: token,
                    message: 'login success'
                },
                { status: 201 }
            )
        }
        return NextResponse.json(
            {
                user: user,      
                message: 'Already Logged in'
            },
            { status: 201 }
        )
    } catch (err) {
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }
}