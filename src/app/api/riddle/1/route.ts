import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const answer = data.answer;
    const correct = process.env.ANSWERONE;

    if (!answer || !correct) {
        return NextResponse.json({ correct: false });
    }

    const userAnswer = String(answer).trim();

    // Support regex stored in ANSWERONE. Two forms accepted:
    // 1) Regex literal like: "/^pattern$/i"  -> pattern and flags parsed
    // 2) Plain string like: "pattern" -> treated as case-insensitive regex
    let isCorrect = false;
    try {
        let pattern = correct;
        let flags = "i"; // default to case-insensitive matching for plain strings

        if (pattern.startsWith("/") && pattern.lastIndexOf("/") > 0) {
            const lastSlash = pattern.lastIndexOf("/");
            flags = pattern.slice(lastSlash + 1) || "";
            pattern = pattern.slice(1, lastSlash);
        }

        const re = new RegExp(pattern, flags);
        isCorrect = re.test(userAnswer);
    } catch (e) {
        // If regex construction fails, fallback to strict equality
        isCorrect = userAnswer === correct;
    }

    return NextResponse.json({ correct: !!isCorrect });
}
