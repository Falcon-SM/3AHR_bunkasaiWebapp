import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const numquiz = data.numquiz;
    const numhints = data.numhints;
    const a=process.env.HINTS;
    if (!a) {
        return NextResponse.json({ hint: "" });
    }else{
        
        return NextResponse.json({ hint: a.split("/")[numquiz].split(".")[numhints] ,saidai:a.split("/")[numquiz].split(".").length});
    }
}