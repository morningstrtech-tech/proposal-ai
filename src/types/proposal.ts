import {
  FileText,
  Briefcase,
  BookOpen,
  Users,
  Award,
  Calendar,
} from "lucide-react";
import React from "react";

// ========================
// Form Data
// ========================
export interface ProposalFormData {
  judul: string;
  org: string;
  kepada: string;
  desc: string;
  tone: string;
  length: string;
  lang: string;
  extra: string;
  logo: string;
  signature: string;
  signatureName: string;
}

export const DEFAULT_FORM_DATA: ProposalFormData = {
  judul: "",
  org: "",
  kepada: "",
  desc: "",
  tone: "formal",
  length: "standar",
  lang: "Indonesia",
  extra: "",
  logo: "",
  signature: "",
  signatureName: "",
};

// ========================
// Proposal Types
// ========================
export interface ProposalTypeInfo {
  title: string;
  desc: string;
  icon: React.ReactElement;
}

export const PROPOSAL_TYPES: Record<string, ProposalTypeInfo> = {
  bisnis: {
    title: "Business",
    desc: "STRATEGIC PLANS FOR INVESTORS.",
    icon: React.createElement(Briefcase, { size: 24, "aria-hidden": true }),
  },
  proyek: {
    title: "Project",
    desc: "METHODOLOGY AND TIMELINE DETAILS.",
    icon: React.createElement(FileText, { size: 24, "aria-hidden": true }),
  },
  penelitian: {
    title: "Research",
    desc: "FORMAL ACADEMIC RESEARCH DOCUMENTS.",
    icon: React.createElement(BookOpen, { size: 24, "aria-hidden": true }),
  },
  kerjasama: {
    title: "Partnership",
    desc: "STRATEGIC PARTNERSHIP AGREEMENTS.",
    icon: React.createElement(Users, { size: 24, "aria-hidden": true }),
  },
  sponsorship: {
    title: "Sponsor",
    desc: "GET SUPPORT FOR YOUR INITIATIVES.",
    icon: React.createElement(Award, { size: 24, "aria-hidden": true }),
  },
  acara: {
    title: "Event",
    desc: "CREATIVE EVENT CONCEPTS & OPS.",
    icon: React.createElement(Calendar, { size: 24, "aria-hidden": true }),
  },
};

export type ProposalTypeKey = keyof typeof PROPOSAL_TYPES;

// ========================
// History Item
// ========================
export interface HistoryItem {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
}
