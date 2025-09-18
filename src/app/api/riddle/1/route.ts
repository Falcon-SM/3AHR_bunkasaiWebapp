import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const answer = data.answer;
    const correct = process.env.ANSWERONE;

    if (answer && correct && answer.trim() === correct) {
        return NextResponse.json({ correct: true });
    } else {
        return NextResponse.json({ correct: false });
    }
}
