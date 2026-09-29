export type IconName = "info" | "pencil" | "users" | "phone" | "doc" | "globe" | "compass" | "lock" | "mountain" | "waves" | "crescent" | "plate" | "prohibit";

const PATHS: Record<IconName, React.ReactNode> = {
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
  pencil: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
  users: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  phone: <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />,
  doc: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a13.7 13.7 0 013.5 9A13.7 13.7 0 0112 21a13.7 13.7 0 01-3.5-9A13.7 13.7 0 0112 3z" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5.5-5.5 2 2-5.5z" /></>,
  lock: <><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
  mountain: <path d="M3 20l6-11 3.5 6L15 10l6 10H3z" />,
  waves: <><path d="M2 7c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" /><path d="M2 12.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" /><path d="M2 18c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" /></>,
  /* Crescent moon — the halal / faith-conscious mark used on the Halal Approved badge and the Prayer-Friendly promise card. */
  crescent: <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
  /* Two concentric circles read as a plate — used for the Halal Dining promise card. */
  plate: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>,
  /* Universal prohibition mark — paired with "Alcohol-Free Stays" text, so the meaning is unambiguous without drawing a specific object. */
  prohibit: <><circle cx="12" cy="12" r="9" /><path d="M5.8 5.8l12.4 12.4" /></>,
};

export default function MegaIcon({ name, className, size = 15 }: { name: IconName; className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
