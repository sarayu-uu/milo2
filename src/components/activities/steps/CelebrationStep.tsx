"use client";

import type { CelebrationStep as CelebrationStepType } from "@/types/activity";
import { useActivity, type StepProps } from "@/features/activities/ActivityContext";
import { Celebration } from "@/components/characters/Celebration";
import { SceneStage } from "@/components/world/SceneStage";
import { Doodle } from "@/components/scrapbook/Doodle";

export function CelebrationStep({ step, onDone }: StepProps<CelebrationStepType>) {
  const { activity } = useActivity();
  return (
    <SceneStage>
      <div className="paper absolute inset-0 rounded-none" style={{ "--paper-bg": "#f7efdf" } as React.CSSProperties} />
      <Doodle name="star" className="absolute top-[14%] left-[18%] h-10 w-10 text-mustard/70" />
      <Doodle name="sun" className="absolute top-[18%] right-[16%] h-12 w-12 text-coral/60" />
      <Doodle name="leaf" className="absolute bottom-[16%] left-[12%] h-10 w-10 text-moss/60" />
      <div className="absolute bottom-[6%] left-1/2 w-[34%] -translate-x-1/2">
        <Celebration type={step.celebration} line={step.line} activityId={activity.id} onDone={onDone} />
      </div>
    </SceneStage>
  );
}
