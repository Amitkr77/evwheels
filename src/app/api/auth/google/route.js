import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
    const { token } = await req.json();

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // payload contains:
        // email, name, picture, sub (Google user id)

        return NextResponse.json({
            user: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                image: payload.picture,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Auth failed" }, { status: 401 });
    }
}
