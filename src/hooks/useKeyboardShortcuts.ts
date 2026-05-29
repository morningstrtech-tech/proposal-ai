"use client";

import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface UseKeyboardShortcutsProps {
  step: number;
  activeTab: "generator" | "history";
  onGenerate: () => void;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  onReset?: () => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

/**
 * Global keyboard shortcut handler.
 * Shortcuts are disabled when user is typing in an input/textarea/editor.
 */
export function useKeyboardShortcuts({
  step,
  activeTab,
  onGenerate,
  onExportPDF,
  onExportWord,
  onReset,
  onNextStep,
  onPrevStep,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isEditing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+Enter — Generate (from step 2)
      if (ctrl && e.key === "Enter" && step === 2 && activeTab === "generator") {
        e.preventDefault();
        onGenerate();
        return;
      }

      // These shortcuts should NOT fire when editing text
      if (isEditing) return;

      // Ctrl+S — Export PDF (from step 3)
      if (ctrl && e.key === "s" && step === 3 && onExportPDF) {
        e.preventDefault();
        onExportPDF();
        return;
      }

      // Ctrl+Shift+S — Export Word (from step 3)
      if (ctrl && e.shiftKey && e.key === "S" && step === 3 && onExportWord) {
        e.preventDefault();
        onExportWord();
        return;
      }

      // Ctrl+N — New/Reset (from step 3)
      if (ctrl && e.key === "n" && step === 3 && onReset) {
        e.preventDefault();
        onReset();
        return;
      }

      // ? key — show shortcuts help
      if (e.key === "?" && !ctrl && !e.shiftKey) {
        e.preventDefault();
        toast(
          "⌨️ Keyboard Shortcuts\n\n" +
            "Ctrl+Enter — Generate proposal\n" +
            "Ctrl+S — Export PDF\n" +
            "Ctrl+Shift+S — Export Word\n" +
            "Ctrl+N — Buat baru\n" +
            "? — Tampilkan bantuan ini",
          {
            duration: 5000,
            style: {
              fontFamily: "var(--font-main)",
              fontSize: "0.85rem",
              whiteSpace: "pre-line",
              lineHeight: 1.8,
              maxWidth: 300,
            },
          }
        );
        return;
      }
    },
    [step, activeTab, onGenerate, onExportPDF, onExportWord, onReset]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
