import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const res = await supabaseAdmin
      .from("RoomNum")
      .select("id, time")
      .in("id", [1, 2, 3, 4, 5, 6]);

    const { data, error, status } = res;

    if (error) {
      console.error("get-room-times supabase error:", error);
      return NextResponse.json({ ok: false, error }, { status: status || 500 });
    }

    // Normalize into map
    const map: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    rows.forEach((row) => {
      const idRaw = row["id"];
      const timeRaw = row["time"];
      const id = Number(idRaw as unknown);
      const time = Number(timeRaw as unknown) || 0;
      if (!Number.isNaN(id) && id >= 1 && id <= 6) map[id] = time;
    });

    return NextResponse.json({ ok: true, data: map });
  } catch (e) {
    console.error("get-room-times unexpected error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
