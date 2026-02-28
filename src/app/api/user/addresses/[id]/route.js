import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Address from "@/models/Address";
import { getUserId } from "@/lib/getUserId";

export async function PATCH(req, { params }) {
    const userId = await getUserId(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const body = await req.json();

    await connectDB();

    const address = await Address.findOne({
        _id: id,
        user: userId,
    });

    if (!address)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.isDefault) {
        await Address.updateMany(
            { user: userId },
            { isDefault: false }
        );
    }

    Object.assign(address, body);
    await address.save();

    return NextResponse.json(address);
}

export async function DELETE(req, { params }) {
    const userId = await getUserId(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;

    await connectDB();

    const address = await Address.findOneAndDelete({
        _id: id,
        user: userId,
    });

    if (!address)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    if (address.isDefault) {
        const firstAddress = await Address.findOne({ user: userId });
        if (firstAddress) {
            firstAddress.isDefault = true;
            await firstAddress.save();
        }
    }

    return NextResponse.json({ message: "Deleted successfully" });
}