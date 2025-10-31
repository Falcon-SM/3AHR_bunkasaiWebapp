"use client";

import React from "react";
import { useRiddles } from "@/app/context/riddleContext";

export default function FooterRoomNum() {
  const { roomnum } = useRiddles();
  const display = roomnum ? String(roomnum) : "-";
  return <p style={{ fontWeight: 600 }}>部屋番号: {display}</p>;
}
