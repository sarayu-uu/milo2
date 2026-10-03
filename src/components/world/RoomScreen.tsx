"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoom } from "@/data/worlds/rooms";
import { useWorld } from "@/hooks/useWorld";
import { Room } from "./Room";

/** Resolves a room id and only lets the child in once the room is open. */
export function RoomScreen({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { rooms } = useWorld();
  const room = getRoom(roomId);
  const status = rooms.find((r) => r.room.id === roomId)?.status;

  useEffect(() => {
    // The living room IS the home page.
    if (roomId === "living-room") router.replace("/");
    else if (!room || status !== "open") router.replace("/world");
  }, [room, status, router, roomId]);

  if (!room || status !== "open" || roomId === "living-room") return null;
  return <Room room={room} />;
}
