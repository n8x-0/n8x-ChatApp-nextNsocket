import bcrypt from 'bcrypt';
import { mongoDBconnection } from "@/DB/connection/connection";
import {User} from '@/DB/models/userModel';
import validatePassword from '@/lib/validateHelper/validatePassword';
import validateEmail from '@/lib/validateHelper/validateEmail';
import * as jose from 'jose';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, imageUrl, email, password } = body;

    if (!validateEmail(email) || !validatePassword(password)) {
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 400 }
        )
    }

    const hash = bcrypt.hashSync(password, 10);

    try {
        await mongoDBconnection();
        const user = await User.create({
            username,
            imageUrl,
            email,
            password: hash
        });

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
                message: 'User created successfully'
            },
            { status: 201 }
        );
    } catch (error) {
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}