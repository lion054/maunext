import { Suspense } from "react";
import { getDestinations } from "@/lib/destinations";
import { getTours } from "@/lib/tours";
import PlanWizard from "./PlanWizard";

export default async function PlanPage() {
  const [destinations, tours] = await Promise.all([getDestinations(), getTours()]);
  return (
    <Suspense fallback={null}>
      <PlanWizard destinations={destinations} tours={tours} />
    </Suspense>
  );
}
