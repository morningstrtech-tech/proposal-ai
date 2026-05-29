"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { getRemainingGenerations, type Plan } from "@/lib/subscription";
import {
  PROPOSAL_TYPES,
  DEFAULT_FORM_DATA,
  type ProposalTypeKey,
  type ProposalFormData,
  type HistoryItem,
} from "@/types/proposal";

// Components
import Sidebar from "@/components/Sidebar";
import ProgressBar from "@/components/ProgressBar";
import FormStep1 from "@/components/FormStep1";
import FormStep2 from "@/components/FormStep2";
import LoadingScreen from "@/components/LoadingScreen";
import OutputViewer from "@/components/OutputViewer";
import HistoryPanel from "@/components/HistoryPanel";
import LoginPromptModal from "@/components/LoginPromptModal";
import UpgradeModal from "@/components/UpgradeModal";
import SuccessConfetti from "@/components/SuccessConfetti";
import OnboardingOverlay, { shouldShowOnboarding } from "@/components/OnboardingOverlay";

// Hooks

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

import type { ProposalTemplate } from "@/lib/templates";

export default function GeneratorPage() {
  // ========================
  // Auth & Session
  // ========================
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const userPlan = (session?.user?.plan as Plan) || "FREE";
  const generationCount = session?.user?.generationCount || 0;
  const remaining = getRemainingGenerations(userPlan, generationCount);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // ========================
  // Core State
  // ========================
  const [currentType, setCurrentType] = useState<ProposalTypeKey>("bisnis");
  const [step, setStep] = useState(1);
  const [loaderMsg, setLoaderMsg] = useState("");
  const [formData, setFormData] = useState<ProposalFormData>(DEFAULT_FORM_DATA);
  const [generatedText, setGeneratedText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ========================
  // UI State
  // ========================
  const [activeTab, setActiveTab] = useState<"generator" | "history">("generator");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);



  // ========================
  // OutputViewer action refs (for keyboard shortcuts)
  // ========================
  const exportPDFRef = useRef<(() => void) | null>(null);
  const exportWordRef = useRef<(() => void) | null>(null);

  // ========================
  // History State
  // ========================
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ========================
  // History Logic
  // ========================
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/proposals");
      const data = await res.json();
      if (res.ok) {
        setHistoryItems(data.proposals || []);
      } else {
        toast.error(data.error || "Gagal memuat riwayat");
      }
    } catch {
      toast.error("Gagal memuat riwayat");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "history" && session) {
      fetchHistory();
    }
  }, [activeTab, session, fetchHistory]);

  // Show onboarding on first visit
  useEffect(() => {
    if (shouldShowOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  const loadFromHistory = useCallback((item: HistoryItem) => {
    setFormData((prev) => ({ ...prev, judul: item.title }));
    setCurrentType(item.type as ProposalTypeKey);
    setGeneratedText(item.content);
    setStep(3);
    setActiveTab("generator");
    toast.success("Proposal dimuat dari riwayat");
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ========================
  // Form Handlers
  // ========================
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    },
    []
  );

  const handleFileChange = useCallback((id: string, base64: string) => {
    setFormData((prev) => ({ ...prev, [id]: base64 }));
  }, []);

  const handleToneChange = useCallback((tone: string) => {
    setFormData((prev) => ({ ...prev, tone }));
  }, []);

  const nextStep = useCallback(() => {
    if (step === 1 && !formData.judul) {
      toast.error("JUDUL HARUS DIISI.");
      return;
    }
    setStep((s) => s + 1);
  }, [step, formData.judul]);

  const prevStep = useCallback(() => setStep((s) => s - 1), []);

  // ========================
  // Generate Proposal
  // ========================
  const generateProposal = useCallback(async () => {
    if (!session) {
      setShowLoginPrompt(true);
      return;
    }

    setErrorMsg("");
    setStep(0);

    const messages = [
      "AUTHENTICATING SESSION...",
      "ANALYZING CONTEXT...",
      "ENGINEERING STRUCTURE...",
      "AI IS SYNTHESIZING...",
      "FORMATTING OUTPUT...",
    ];

    for (const msg of messages) {
      setLoaderMsg(msg);
      await new Promise((r) => setTimeout(r, 800));
    }

    setLoaderMsg("WAITING FOR AI RESPONSE...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: currentType, ...formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsUpgrade) {
          setStep(1);
          setShowUpgradeModal(true);
          return;
        }
        // Handle rate limiting specifically
        if (res.status === 429) {
          const retryAfter = data.retryAfter || 60;
          setStep(2);
          toast.error(`Terlalu banyak permintaan. Tunggu ${retryAfter} detik.`, { duration: 5000 });
          return;
        }
        throw new Error(data.error || "Failed to generate proposal");
      }

      setGeneratedText(data.content);
      setStep(3);
      setShowConfetti(true);
      
      // Update session with new generation count so UI updates immediately
      if (data.generationCount !== undefined) {
        update({ generationCount: data.generationCount, plan: data.plan });
      }

      toast.success("Proposal berhasil dibuat! ✨", {
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: "var(--bg-card)",
          color: "var(--text-main)",
          fontFamily: "var(--font-main)",
          fontWeight: 600,
          boxShadow: "var(--shadow-lg)",
          padding: "16px 24px",
        },
        iconTheme: {
          primary: "var(--secondary)",
          secondary: "var(--bg-card)",
        },
      });
      // Reset confetti trigger after animation
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred");
      setStep(2);
    }
  }, [session, currentType, formData]);

  // ========================
  // Reset
  // ========================
  const handleReset = useCallback(() => {
    setStep(1);
    setGeneratedText("");
    setErrorMsg("");
  }, []);

  // ========================
  // Keyboard Shortcuts
  // ========================
  useKeyboardShortcuts({
    step,
    activeTab,
    onGenerate: generateProposal,
    onExportPDF: () => exportPDFRef.current?.(),
    onExportWord: () => exportWordRef.current?.(),
    onReset: handleReset,
  });

  // ========================
  // Templates
  // ========================
  const handleLoadTemplate = useCallback((template: ProposalTemplate) => {
    setFormData((prev) => ({
      ...prev,
      judul: template.judul || "",
      org: template.org || "",
      kepada: template.kepada || "",
      desc: template.desc || "",
      tone: template.tone || prev.tone,
      length: template.length || prev.length,
      lang: template.lang || prev.lang,
    }));
    toast.success(`Template '${template.templateName}' berhasil dimuat!`);
  }, []);

  // ========================
  // Sidebar handlers
  // ========================
  const handleSelectType = useCallback((type: ProposalTypeKey) => {
    setCurrentType(type);
    setActiveTab("generator");
  }, []);

  const handleSelectHistory = useCallback(() => {
    setActiveTab("history");
  }, []);

  // Don't render until authenticated
  if (status !== "authenticated") {
    return null;
  }

  // ========================
  // Render
  // ========================
  return (
    <div className="app-layout">
      <Toaster position="top-center" />
      <SuccessConfetti trigger={showConfetti} />

      <Sidebar
        currentType={currentType}
        activeTab={activeTab}
        session={session}
        userPlan={userPlan}
        remaining={remaining}
        onSelectType={handleSelectType}
        onSelectHistory={handleSelectHistory}
      />

      <main className="flex-1 container-material" id="main-content">
        <header style={{ marginBottom: "5rem" }}>
          <span className="subheading-material">
            {currentType.toUpperCase()} ENGINE v4.0
          </span>
          <h1 className="heading-material">
            GENERATE <span>{PROPOSAL_TYPES[currentType].title}</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", maxWidth: "600px", lineHeight: 1.6 }}>
            {PROPOSAL_TYPES[currentType].desc}
          </p>
        </header>

        {activeTab === "history" ? (
          <HistoryPanel
            items={historyItems}
            loading={loadingHistory}
            onLoadItem={loadFromHistory}
            onDeleteItem={deleteFromHistory}
          />
        ) : (
          <>
            <ProgressBar currentStep={step} />

            {/* Error Banner */}
            {errorMsg && (
              <div
                role="alert"
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "8px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--accent)",
                  marginBottom: "2rem",
                  fontSize: "0.9rem",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <strong>ERROR:</strong> {errorMsg}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <FormStep1
                  currentType={currentType}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onLoadTemplate={handleLoadTemplate}
                  onNext={nextStep}
                />
              )}

              {step === 2 && (
                <FormStep2
                  formData={formData}
                  sessionStatus={status}
                  isLoggedIn={!!session}
                  onInputChange={handleInputChange}
                  onFileChange={handleFileChange}
                  onToneChange={handleToneChange}
                  onBack={prevStep}
                  onGenerate={generateProposal}
                />
              )}

              {step === 0 && <LoadingScreen message={loaderMsg} />}

              {step === 3 && (
                <OutputViewer
                  content={generatedText}
                  title={formData.judul}
                  onContentChange={setGeneratedText}
                  onReset={handleReset}
                  onRegisterExportPDF={(fn) => { exportPDFRef.current = fn; }}
                  onRegisterExportWord={(fn) => { exportWordRef.current = fn; }}
                  logo={formData.logo}
                  signature={formData.signature}
                  signatureName={formData.signatureName}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </main>

      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={userPlan}
        remainingGenerations={remaining}
      />

      {showOnboarding && (
        <OnboardingOverlay onDismiss={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
