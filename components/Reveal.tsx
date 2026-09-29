"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section";
};

/** Scroll-triggered fade/rise-in. Reusable wrapper so pages don't hand-roll IntersectionObserver logic. */
export default function Reveal({ children, delay = 0, y = 24, className, style, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.01 : 0.6, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
    },
  };
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}
