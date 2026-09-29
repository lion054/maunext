import MegaIcon from "./MegaIcon";

const LABEL: Record<string, string> = { sublime: "Sublime", halal: "Halal Approved" };

export default function CollectionBadges({ collections, className }: { collections?: ("sublime" | "halal")[]; className?: string }) {
  if (!collections || collections.length === 0) return null;
  return (
    <div className={className} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {collections.map((c) => (
        <span key={c} className={`collection-badge collection-badge--${c}`}>
          {c === "halal" ? <MegaIcon name="crescent" size={11} /> : <span aria-hidden="true">✦</span>}
          {LABEL[c]}
        </span>
      ))}
    </div>
  );
}
