"use client";

interface ProgressBarProps {
  currentStep: number;
}

const STEP_LABELS = ["Context", "Archetype", "Output"];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div
      className="flex items-center gap-0 progress-material"
      style={{ marginBottom: "4rem" }}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={3}
      aria-label={`Langkah ${currentStep} dari 3: ${STEP_LABELS[currentStep - 1] || ""}`}
    >
      {STEP_LABELS.map((label, index) => {
        const stepNum = index + 1;
        return (
          <div
            key={stepNum}
            className={`flex-1 flex items-center justify-center progress-step ${currentStep >= stepNum ? "progress-step-active" : ""}`}
          >
            <div className={`progress-step-text ${currentStep >= stepNum ? "progress-step-text-active" : ""}`}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
