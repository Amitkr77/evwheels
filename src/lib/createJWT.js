import jwt from "jsonwebtoken";

export function createJWT(user) {
    if (!user || !user.id) {
        throw new Error("User object with id is required to create JWT");
    }

    const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
        issuer: "evwheels",
    });

    return token;
}
export function verifyJWT(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}