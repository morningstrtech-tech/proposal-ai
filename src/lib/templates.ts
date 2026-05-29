import { ProposalTypeKey, ProposalFormData } from "@/types/proposal";

export interface ProposalTemplate extends Partial<ProposalFormData> {
  id: string;
  type: ProposalTypeKey;
  templateName: string;
}

export const PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  // Business Templates
  {
    id: "bus-1",
    type: "bisnis",
    templateName: "Retail Expansion",
    judul: "Ekspansi Cabang Retail Q3 2025",
    org: "PT Maju Bersama",
    kepada: "Dewan Direksi & Investor",
    desc: "Proposal ini bertujuan untuk mengajukan anggaran ekspansi 5 cabang baru di wilayah Jawa Timur untuk menangkap peluang pasar kelas menengah yang sedang berkembang pesat. Fokus pada lokasi strategis dekat pusat perbelanjaan.",
    tone: "formal",
    length: "lengkap",
    lang: "Indonesia",
  },
  {
    id: "bus-2",
    type: "bisnis",
    templateName: "B2B Software Solution",
    judul: "Implementasi ERP Terintegrasi",
    org: "TechSolutions Inc.",
    kepada: "Bapak Budi Santoso - CEO Perusahaan",
    desc: "Penawaran solusi perangkat lunak ERP untuk mengotomatisasi proses supply chain, HR, dan finance. Diharapkan efisiensi naik 30% dalam tahun pertama.",
    tone: "meyakinkan",
    length: "standar",
    lang: "Indonesia",
  },
  
  // Project Templates
  {
    id: "proj-1",
    type: "proyek",
    templateName: "Website Redesign",
    judul: "Redesign Website E-Commerce Utama",
    org: "Creative Digital Studio",
    kepada: "Tim Marketing & IT",
    desc: "Proyek perombakan total UI/UX website untuk meningkatkan conversion rate. Termasuk migrasi ke Next.js, integrasi headless CMS, dan optimasi mobile.",
    tone: "kreatif",
    length: "standar",
    lang: "Indonesia",
  },
  
  // Research Templates
  {
    id: "res-1",
    type: "penelitian",
    templateName: "Market Analysis",
    judul: "Analisis Pasar Kendaraan Listrik 2025",
    org: "Lembaga Riset Independen",
    kepada: "Kementerian Perindustrian",
    desc: "Studi komprehensif mengenai tingkat adopsi kendaraan listrik di kota-kota besar di Indonesia, kendala infrastruktur, dan rekomendasi kebijakan.",
    tone: "formal",
    length: "lengkap",
    lang: "Indonesia",
  },

  // Partnership Templates
  {
    id: "part-1",
    type: "kerjasama",
    templateName: "Co-Branding Campaign",
    judul: "Kerjasama Co-Branding Summer Collection",
    org: "Lifestyle Brand X",
    kepada: "Brand Kosmetik Y",
    desc: "Mengajukan kerjasama kampanye musim panas dengan merilis produk bundel eksklusif, event launching bersama, dan cross-promotion di media sosial.",
    tone: "meyakinkan",
    length: "singkat",
    lang: "Indonesia",
  },

  // Sponsor Templates
  {
    id: "spon-1",
    type: "sponsorship",
    templateName: "Tech Conference",
    judul: "Tech Innovators Summit 2025",
    org: "Komunitas Developer Indonesia",
    kepada: "Perusahaan Teknologi / Calon Sponsor",
    desc: "Permohonan dukungan dana untuk acara konferensi teknologi tahunan yang dihadiri 5000+ developer. Menawarkan eksposur logo, booth pameran, dan slot pembicara.",
    tone: "meyakinkan",
    length: "standar",
    lang: "Indonesia",
  },

  // Event Templates
  {
    id: "evt-1",
    type: "acara",
    templateName: "Music Festival",
    judul: "Harmoni Alam Music Fest",
    org: "Event Organizer Z",
    kepada: "Pemerintah Daerah & Sponsor",
    desc: "Konsep festival musik outdoor selama 2 hari yang menggabungkan artis lokal dan nasional dengan kampanye peduli lingkungan. Target pengunjung 10,000 orang.",
    tone: "kreatif",
    length: "standar",
    lang: "Indonesia",
  }
];
