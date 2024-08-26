import { parse } from 'cookie';
import * as jose from 'jose';

export async function getUserId(request: Request): Promise<string> {
    const cookieHeader = request.headers.get("cookie") || '';
    const cookies = parse(cookieHeader);

    const token = cookies.token;

    if (!token) {
        throw new Error('Authentication token is missing');
    }

    const secret = new TextEncoder().encode(process.env.JWT_TOKEN);
    const { payload } = await jose.jwtVerify(token, secret);

    return payload.sub as string;
}