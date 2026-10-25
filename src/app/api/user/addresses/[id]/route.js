import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Address from "@/models/Address";
import { getUserId } from "@/lib/getUserId";

export async function PATCH(req, { params }) {
    const userId = await getUserId(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const address = await Address.findOne({
        _id: id,
        user: userId,
    });

    if (!address)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Whitelist only allowed fields — prevent IDOR via user field override
    const { fullName, phone, addressLine, city, state, postalCode, country, isDefault } = body;

    if (isDefault) {
        await Address.updateMany(
            { user: userId },
            { isDefault: false }
        );
    }

    if (fullName !== undefined) address.fullName = fullName;
    if (phone !== undefined) address.phone = phone;
    if (addressLine !== undefined) address.addressLine = addressLine;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    return NextResponse.json(address);
}

export async function DELETE(req, { params }) {
    const userId = await getUserId(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

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