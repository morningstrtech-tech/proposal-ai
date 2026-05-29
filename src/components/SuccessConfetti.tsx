"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface SuccessConfettiProps {
  /** Fire confetti when this becomes true */
  trigger: boolean;
}

/**
 * Fires a celebratory confetti burst using canvas-confetti.
 * Two bursts from bottom-left and bottom-right for a rewarding effect.
 */
export default function SuccessConfetti({ trigger }: SuccessConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    // Short delay so the UI transition finishes first
    const timeout = setTimeout(() => {
      // Left burst
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x: 0.25, y: 0.7 },
        colors: ["#1a73e8", "#34a853", "#fbbc04", "#ea4335", "#4285f4"],
        ticks: 120,
        gravity: 1.2,
        scalar: 0.9,
        drift: 0,
      });

      // Right burst
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x: 0.75, y: 0.7 },
        colors: ["#1a73e8", "#34a853", "#fbbc04", "#ea4335", "#4285f4"],
        ticks: 120,
        gravity: 1.2,
        scalar: 0.9,
        drift: 0,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [trigger]);

  // This component renders nothing — it's purely side-effect driven
  return null;
}
