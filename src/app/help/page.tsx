"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, MessageCircle, FileText, Video, ChevronRight, Zap } from "lucide-react";

const faqs = [
  { q: "How do I create a new project?", a: "Go to Projects in the sidebar and click 'New Project'. Fill in the details and assign team members." },
  { q: "Can I drag tasks between Kanban columns?", a: "Yes! Open a project's Kanban view and drag any task card to a different column to update its status." },
  { q: "How do I invite team members?", a: "Navigate to the Team page and click 'Invite Member'. Enter their email to send an invitation." },
  { q: "Where can I see the project timeline?", a: "Open a project from the Kanban view and switch to the Timeline tab, or click Timeline in the sidebar." },
];

export default function HelpPage() {
  const { isAuthenticated, isInitialized } = useAppStore();
  const router = useRouter();
  useEffect(() => { 
    if (isInitialized && !isAuthenticated) router.push("/login"); 
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden border" style={{ backgroundColor: "#111111", borderColor: "#1f1f1f" }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#d3f000 1px, transparent 1px), linear-gradient(90deg, #d3f000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: "#d3f000" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} style={{ color: "#d3f000" }} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "#d3f000" }}>Help Center</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">How can we help?</h1>
            <p className="text-[#555555] text-[13px] mb-5">Find answers, documentation and support resources.</p>
            <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 max-w-md border" style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#555555]">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search documentation..." className="bg-transparent text-[13px] text-white placeholder:text-[#555555] outline-none flex-1" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Documentation", icon: BookOpen, desc: "Full feature guide" },
            { label: "Live Chat", icon: MessageCircle, desc: "Talk to support" },
            { label: "Release Notes", icon: FileText, desc: "What's new" },
            { label: "Video Tutorials", icon: Video, desc: "Step-by-step guides" },
          ].map(({ label, icon: Icon, desc }) => (
            <button key={label} className="rounded-xl border p-4 flex flex-col items-start gap-2 transition-all hover:border-[#d3f000]/30 group text-left" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: "#222222" }}>
                <Icon size={15} className="text-[#555555] group-hover:text-[#d3f000] transition-colors" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-white">{label}</p>
                <p className="text-[10px] text-[#555555]">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="rounded-xl border overflow-hidden mb-4" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "#2a2a2a" }}>
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Frequently Asked Questions</h2>
          </div>
          <div>
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="px-5 py-4 hover:bg-[#1f1f1f] transition-colors cursor-pointer group border-b last:border-b-0" style={{ borderColor: "#1f1f1f" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-white group-hover:text-[#d3f000] transition-colors mb-1">{q}</p>
                    <p className="text-[11px] text-[#555555] leading-relaxed">{a}</p>
                  </div>
                  <ChevronRight size={13} className="text-[#333333] group-hover:text-[#d3f000] shrink-0 mt-0.5 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl border p-5 flex items-center justify-between" style={{ backgroundColor: "#111111", borderColor: "#1f1f1f" }}>
          <div>
            <p className="text-[13px] font-bold text-white">Still need help?</p>
            <p className="text-[11px] text-[#555555] mt-0.5">Our support team responds within 2 hours.</p>
          </div>
          <button className="text-[12px] font-black text-black px-4 py-2.5 rounded-lg hover:opacity-90 transition-all" style={{ backgroundColor: "#d3f000" }}>
            Contact Support
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
