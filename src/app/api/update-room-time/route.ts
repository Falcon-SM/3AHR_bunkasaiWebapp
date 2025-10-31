import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// body shape is validated at runtime; keep types minimal to satisfy linter

export async function POST(request: Request) {
  try {
    let body: unknown = null;
    try {
      body = await request.json();
    } catch (err) {
      console.error("update-room-time: failed to parse JSON body", err);
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
    }

  // validate shape
  const bodyObj = body as Record<string, unknown>;
  const roomIdRaw = bodyObj["roomId"];
  const elapsedTimeRaw = bodyObj["elapsedTime"];
  const roomId = Number(roomIdRaw as unknown);
  const elapsedTime = Number(elapsedTimeRaw as unknown);

    if (typeof roomId !== "number" || typeof elapsedTime !== "number") {
      return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
    }

    if (roomId < 1 || roomId > 6) {
      return NextResponse.json({ ok: false, message: "invalid roomId" }, { status: 400 });
    }

    // upsert: update if exists otherwise insert
    const upsertRes = await supabaseAdmin
      .from("RoomNum")
      .upsert([{ id: roomId, time: elapsedTime }], { onConflict: "id" })
      .select();

    const { data, error, status } = upsertRes;

    if (error) {
      console.error("supabaseAdmin upsert error:", error);
      return NextResponse.json({ ok: false, error }, { status: status || 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("update-room-time error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
