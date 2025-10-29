import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const numquiz = data.numquiz;
    const numhints = data.numhints;
    if (!process.env.HINT) {
        return NextResponse.json({ hint: "" });
    }else{
        return NextResponse.json({ hint: process.env.HINT.split("/")[numquiz].split(".")[numhints] ,saidai:process.env.HINT.split("/")[numquiz].split(".").length});
    }
}