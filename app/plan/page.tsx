import { Suspense } from "react";
import PlanWizard from "./PlanWizard";

export default function PlanPage() {
  return (
    <Suspense fallback={null}>
      <PlanWizard />
    </Suspense>
  );
}
