"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Chromium-only Network Information API; absent on Safari/Firefox, where we fall
 *  back to loading the video as before — this only ever makes the page lighter,
 *  never heavier, for browsers that don't support it. */
type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export default function ParallaxHero({
  image,
  video,
  className,
  overlayClassName,
  children,
}: {
  image: string;
  video?: string;
  className: string;
  overlayClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.4]);

  // Skip the multi-MB hero video for visitors who've asked for less data or are on
  // a slow connection — they get the (already-required) poster image instead.
  const [skipVideo, setSkipVideo] = useState(false);
  useEffect(() => {
    const conn = (navigator as unknown as { connection?: NetworkInformation }).connection;
    if (!conn) return;
    if (conn.saveData || (conn.effectiveType && /2g/.test(conn.effectiveType))) setSkipVideo(true);
  }, []);

  return (
    <section ref={ref} className={className}>
      {/* The parallax background needs to be clipped to the hero's box (its own y-transform
       *  and the -10% inset would otherwise spill past the hero's edges during scroll) —
       *  but that overflow:hidden used to sit on the section itself, which also clips any
       *  popover (like HeroSearch's date picker) rendered in {children} the moment it opens
       *  past the hero's bottom edge. Scoping the clip to just this background wrapper lets
       *  children escape it instead. */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <motion.div
          style={{
            position: "absolute",
            inset: "-10% 0 0 0",
            y,
            opacity,
          }}
        >
          {video && !reduce && !skipVideo ? (
            <video
              className="heroBgVideo"
              src={video}
              poster={image}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 70%" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center 70%",
              }}
            />
          )}
        </motion.div>
        {overlayClassName && <div className={overlayClassName} />}
      </div>
      {children}
    </section>
  );
}
