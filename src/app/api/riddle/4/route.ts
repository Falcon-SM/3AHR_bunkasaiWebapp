import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const answer = data.answer;
    const correct = process.env.ANSWERFOUR?.split(".");
    const osii =process.env.OSIIFOUR

    if (answer && correct && correct.indexOf(answer.trim())>-1) {
        return NextResponse.json({ correct: true });
    }else if(answer && correct && answer.trim() == osii){
        return NextResponse.json({ correct: false,osii:true })
    } else {
        return NextResponse.json({ correct: false,osii:false });
    }
}
