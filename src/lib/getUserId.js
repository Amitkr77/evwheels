import jwt from "jsonwebtoken";

export async function getUserId(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch {
        return null;
    }
}