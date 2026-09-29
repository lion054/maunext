export default function Stars({ n, size = 13, className, hidden = false }: { n: number; size?: number; className?: string; hidden?: boolean }) {
  const filled = Math.round(n);
  return (
    <span className={className} {...(hidden ? { "aria-hidden": true } : { "aria-label": `${n} out of 5 stars` })}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
