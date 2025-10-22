import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const answer = data.answer;
    let correct="a"
    if (process.env.ANSWERSHO!==undefined)
      correct = process.env.ANSWERSHO.split("/")[data.num];

    if (answer && correct && answer.trim() === correct) {
        return NextResponse.json({ correct: true });
    } else {
        return NextResponse.json({ correct: false});
    }
}
