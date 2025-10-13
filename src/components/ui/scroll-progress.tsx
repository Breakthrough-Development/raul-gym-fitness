"use client";

import { motion, MotionProps, useScroll } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

type ScrollProgressProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
>;

export const ScrollProgress = React.forwardRef<
  HTMLDivElement,
  ScrollProgressProps
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
