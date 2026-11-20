"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  decimals = 0,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayVal, setDisplayVal] = useState<number>(target);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDisplayVal(target);
      return;
    }

    let rafId = 0;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // Ease-out cubic for smooth luxury deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        setDisplayVal(current);

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setDisplayVal(target);
        }
      };

      setDisplayVal(0);
      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, durationMs]);

  const formatted =
    decimals > 0
      ? displayVal.toFixed(decimals)
      : Math.round(displayVal).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
