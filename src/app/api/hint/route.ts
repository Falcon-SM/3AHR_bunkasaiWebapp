import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const numquiz = data.numquiz;
    const numhints = data.numhints;
    if (!process.env.HINTS) {
        return NextResponse.json({ hint: "" });
    }else{
        return NextResponse.json({ hint: process.env.HINTS.split("/")[numquiz].split(".")[numhints] });
    }
}