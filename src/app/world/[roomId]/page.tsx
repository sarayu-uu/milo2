import { MILO_HOME } from "@/data/worlds/rooms";
import { RoomScreen } from "@/components/world/RoomScreen";

export function generateStaticParams() {
  return MILO_HOME.rooms.map((r) => ({ roomId: r.id }));
}

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  return <RoomScreen roomId={roomId} />;
}
