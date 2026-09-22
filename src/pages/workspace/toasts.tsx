import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import {
  IconCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconX,
} from "@tabler/icons-react";
import { Scene, SceneCard, Action } from "@/components/overtrue/scenes/shared";
const examples = [
  {
    title: "Changes saved",
    description: "Your workspace preferences are up to date.",
    icon: IconCheck,
    tone: "success",
    trigger: "Save preferences",
  },
  {
    title: "Export ready",
    description: "Your project report is ready in the reports view.",
    icon: IconInfoCircle,
    tone: "info",
    trigger: "Prepare report",
  },
  {
    title: "Connection interrupted",
    description: "Your draft is safe. Check your connection and try again.",
    icon: IconAlertTriangle,
    tone: "warning",
    trigger: "Preview connection notice",
  },
];
export default function Page() {
  const [notice, setNotice] = useState<number | null>(null),
    [generation, setGeneration] = useState(0);
  return (
    <Scene
      id="toasts"
      title="A small, useful update"
      description="Clear feedback for completed actions, background work, and recoverable problems."
    >
      <Toast.Provider duration={6000}>
        <div className="scene-grid-three showcase-grid">
          {examples.map((item, i) => (
            <SceneCard
              key={item.title}
              title={["Success", "Information", "Attention"][i]}
              description={
                [
                  "Confirm that the work was saved.",
                  "Share a result without interrupting.",
                  "Explain what happened and what to do.",
                ][i]
              }
            >
              <div className={`showcase-toast-preview is-${item.tone}`}>
                <item.icon size={20} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>
              <Action
                onClick={() => {
                  setNotice(i);
                  setGeneration((g) => g + 1);
                }}
              >
                {item.trigger}
              </Action>
            </SceneCard>
          ))}
        </div>
        <SceneCard title="Feedback that leaves room to work">
          <p>
            Try an example above. The notification appears in the lower corner,
            pauses while you read it, and can be dismissed with its close button
            or Escape.
          </p>
          <p>
            Use persistent inline guidance when a problem needs a decision
            before someone can continue.
          </p>
        </SceneCard>
        {notice !== null && (
          <Toast.Root
            key={generation}
            className={`showcase-toast is-${examples[notice].tone}`}
            onOpenChange={(open) => {
              if (!open) setNotice(null);
            }}
          >
            <div>
              <Toast.Title className="showcase-toast-title">
                {examples[notice].title}
              </Toast.Title>
              <Toast.Description>
                {examples[notice].description}
              </Toast.Description>
              {notice === 1 && (
                <Toast.Action asChild altText="Open project reports">
                  <a href="#/datatables">View report</a>
                </Toast.Action>
              )}
            </div>
            <Toast.Close aria-label="Dismiss notification">
              <IconX size={16} />
            </Toast.Close>
          </Toast.Root>
        )}
        <Toast.Viewport className="showcase-toast-viewport" />
      </Toast.Provider>
    </Scene>
  );
}
