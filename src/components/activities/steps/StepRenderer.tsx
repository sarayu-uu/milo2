"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ActivityStep, AgeBand, InteractiveKey, InteractiveStep } from "@/types/activity";
import type { StepProps } from "@/features/activities/ActivityContext";
import { StoryStage } from "./StoryStage";
import { CountGame } from "./CountGame";
import { PatternGame } from "./PatternGame";
import { ChoiceGame } from "./ChoiceGame";
import { MatchGame } from "./MatchGame";
import { InstructionCards } from "./InstructionCards";
import { MovementGame } from "./MovementGame";
import { ParentChildCard } from "./ParentChildCard";
import { ExtensionOffer } from "./ExtensionOffer";
import { ReflectionCard } from "./ReflectionCard";
import { CelebrationStep } from "./CelebrationStep";

const DrawCanvas = dynamic(() => import("./DrawCanvas").then((m) => m.DrawCanvas), { ssr: false });

/**
 * Bespoke interactive components, code-split. Add a new one here and
 * reference its key from activity data — no navigation changes needed.
 */
const INTERACTIVES: Record<InteractiveKey, ComponentType<StepProps<InteractiveStep>>> = {
  "shadow-follow": dynamic(() => import("../interactive/ShadowFollow").then((m) => m.ShadowFollow), { ssr: false }),
  "shadow-discovery": dynamic(() => import("../interactive/ShadowDiscovery").then((m) => m.ShadowDiscovery), { ssr: false }),
  "shape-detective": dynamic(() => import("../interactive/ShapeDetective").then((m) => m.ShapeDetective), { ssr: false }),
  "shape-sort": dynamic(() => import("../interactive/ShapeSort").then((m) => m.ShapeSort), { ssr: false }),
};

export function StepRenderer({
  step,
  band,
  onDone,
  onAcceptExtension,
  onSkipExtension,
}: {
  step: ActivityStep;
  band: AgeBand;
  onDone: () => void;
  onAcceptExtension: (steps: ActivityStep[]) => void;
  onSkipExtension: () => void;
}) {
  switch (step.type) {
    case "story":
      return <StoryStage step={step} band={band} onDone={onDone} />;
    case "interactive": {
      const Comp = INTERACTIVES[step.component];
      return <Comp step={step} band={band} onDone={onDone} />;
    }
    case "count":
      return <CountGame step={step} band={band} onDone={onDone} />;
    case "pattern":
      return <PatternGame step={step} band={band} onDone={onDone} />;
    case "choice":
      return <ChoiceGame step={step} band={band} onDone={onDone} />;
    case "match":
      return <MatchGame step={step} band={band} onDone={onDone} />;
    case "draw":
      return <DrawCanvas step={step} band={band} onDone={onDone} />;
    case "instructions":
      return <InstructionCards step={step} band={band} onDone={onDone} />;
    case "movement":
      return <MovementGame step={step} band={band} onDone={onDone} />;
    case "parent-child":
      return <ParentChildCard step={step} band={band} onDone={onDone} />;
    case "extension-offer":
      return <ExtensionOffer step={step} band={band} onAccept={onAcceptExtension} onSkip={onSkipExtension} />;
    case "reflection":
      return <ReflectionCard step={step} band={band} onDone={onDone} />;
    case "celebration":
      return <CelebrationStep step={step} band={band} onDone={onDone} />;
  }
}
