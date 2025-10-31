"use client";

import { useEffect } from "react";
import { useRiddles } from "@/app/context/riddleContext";
// note: client-side public supabase is not safe for writes when RLS prevents it.
// We'll call a server API that uses the service_role key instead.

export default function TimeUpdater() {
  const { startTime, roomnum, setRoomnum, paused } = useRiddles();

  useEffect(() => {
    const roomNumFromStorage = localStorage.getItem("roomnum");
    if (roomNumFromStorage) {
      setRoomnum(roomNumFromStorage);
      return;
    }

    // fallback to cookie 'roomnum' if localStorage is missing (persisted for 30 days)
    try {
      const match = document.cookie.match(new RegExp('(^| )' + 'roomnum' + '=([^;]+)'));
      const cookieVal = match ? decodeURIComponent(match[2]) : null;
      if (cookieVal) setRoomnum(cookieVal);
    } catch {
      // ignore cookies if access fails
    }
  }, [setRoomnum]);

  useEffect(() => {
    const validRooms = ["1", "2", "3", "4", "5", "6"];
    // If roomnum is not yet set in context, try reading again from localStorage
    if (!roomnum) {
      const again = localStorage.getItem("roomnum");
      if (again) setRoomnum(again);
    }

    // Don't start the updater while paused
    if (paused) {
      console.log("TimeUpdater: paused, not starting interval");
      return;
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

          let payload: unknown = null;
          try {
            payload = await resp.json();
          } catch (err) {
            console.warn("update-room-time returned non-json", err);
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
  }, [startTime, roomnum, paused, setRoomnum]);

  return null;
}
