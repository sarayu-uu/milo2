import { activityIds } from "@/data/activities";
import { ActivityScreen } from "@/components/activities/ActivityScreen";

export function generateStaticParams() {
  return activityIds().map((activityId) => ({ activityId }));
}

export default async function ActivityPage({ params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params;
  return <ActivityScreen activityId={activityId} />;
}
