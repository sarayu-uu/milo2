import type { RoomDefinition } from "@/types/world";
import { RoomShell } from "./RoomShell";
import { GardenScene, KitchenScene, WashroomScene } from "./scenes/rooms";

/** A room's background: its painted scene if it has one, otherwise the plain wall + floor box. */
export function RoomBackground({ room }: { room: RoomDefinition }) {
  switch (room.scene) {
    case "kitchen":
      return <KitchenScene />;
    case "washroom":
      return <WashroomScene />;
    case "garden":
      return <GardenScene />;
    default:
      return <RoomShell palette={room.palette} outdoor={room.id === "garden"} />;
  }
}
