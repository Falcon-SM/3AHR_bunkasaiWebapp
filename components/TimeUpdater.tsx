"use client";

import { useEffect } from "react";
import { useRiddles } from "@/app/context/riddleContext";
// note: client-side public supabase is not safe for writes when RLS prevents it.
// We'll call a server API that uses the service_role key instead.

export default function TimeUpdater() {
  const { startTime, roomnum, setRoomnum } = useRiddles();

  useEffect(() => {
    const roomNumFromStorage = localStorage.getItem("roomnum");
    if (roomNumFromStorage) {
      setRoomnum(roomNumFromStorage);
    }
  }, [setRoomnum]);

  useEffect(() => {
    const validRooms = ["1", "2", "3", "4", "5", "6"];
    // If roomnum is not yet set in context, try reading again from localStorage
    if (!roomnum) {
      const again = localStorage.getItem("roomnum");
      if (again) setRoomnum(again);
    }

    if (startTime && roomnum && validRooms.includes(roomnum)) {
      const roomId = Number(roomnum);
      console.log("TimeUpdater: starting interval", { roomId, startTime });
      const interval = setInterval(async () => {
        const now = Date.now();
        const elapsedTime = Math.floor((now - (Number(startTime) || 0)) / 1000);
        console.log("TimeUpdater tick", { roomId, startTime, now, elapsedTime });
        try {
          // POST to internal API which performs the upsert using a service role key
          const resp = await fetch("/api/update-room-time", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, elapsedTime }),
          });

          let payload: any = null;
          try {
            payload = await resp.json();
          } catch (e) {
            console.warn("update-room-time returned non-json", e);
          }

          console.log("update-room-time response:", { status: resp.status, payload });
          if (!resp.ok) {
            console.error("Failed to update room time via API", { status: resp.status, payload });
          }
        } catch (e) {
          console.error("Unexpected error calling update-room-time API:", e);
        }
      }, 10000);

      return () => {
        console.log("TimeUpdater: clearing interval", { roomId });
        clearInterval(interval);
      };
    }
  }, [startTime, roomnum]);

  return null;
}
