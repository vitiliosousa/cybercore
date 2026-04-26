"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Project } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Users, ChevronDown } from "lucide-react";

const teamMembers = ["Sarah Jenkins", "David Chen", "Elena Rodriguez", "Mike Ross", "Anya Patel", "James Liu"];

export default function CreateProjectPage() {
  const { isAuthenticated, addProject } = useAppStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", lead: "", dueDate: "", status: "active" as Project["status"] });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, [isAuthenticated, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Project name is required.";
    if (!form.lead) e.lead = "Please select a lead.";
    if (!form.dueDate) e.dueDate = "Due date is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    addProject({ id: String(Date.now()), name: form.name, description: form.description, status: form.status, lead: form.lead, dueDate: form.dueDate, progress: 0, tasks: [], members: selectedMembers.length ? selectedMembers : [form.lead] });
    router.push("/projects");
  };

  const toggleMember = (m: string) => setSelectedMembers((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);

  if (!isAuthenticated) return null;

  const inputCls = "w-full px-4 py-3 rounded-lg border text-[13px] text-white outline-none transition-all";
  const inputStyle = { backgroundColor: "#181818", borderColor: "#2a2a2a", color: "#fff" };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[12px] text-[#555555] hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Projects
        </button>

        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
          <div className="px-6 py-5 border-b" style={{ borderColor: "#2a2a2a" }}>
            <h1 className="text-base font-black text-white tracking-tight">Create New Project</h1>
            <p className="text-[12px] text-[#555555] mt-1">Set up a new project and assign your team.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Project Name</label>
              <input id="project-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} style={inputStyle} placeholder="e.g. Quantum Neural Network"
                onFocus={(e) => { e.currentTarget.style.borderColor = "#d3f000"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(211,240,0,0.08)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.boxShadow = "none"; }}
              />
              {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Description</label>
              <textarea id="project-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputCls} resize-none`} style={inputStyle} placeholder="Brief description..."
                onFocus={(e) => { e.currentTarget.style.borderColor = "#d3f000"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(211,240,0,0.08)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Lead */}
              <div>
                <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Project Lead</label>
                <div className="relative">
                  <select id="project-lead" value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} className={`${inputCls} appearance-none pr-8`} style={{ ...inputStyle, backgroundColor: "#181818" }}>
                    <option value="">Select lead...</option>
                    {teamMembers.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
                </div>
                {errors.lead && <p className="mt-1 text-[11px] text-red-400">{errors.lead}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Status</label>
                <div className="relative">
                  <select id="project-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })} className={`${inputCls} appearance-none pr-8`} style={{ ...inputStyle, backgroundColor: "#181818" }}>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Due Date</label>
              <div className="relative">
                <input id="project-due-date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className={`${inputCls} pr-10`} style={{ ...inputStyle, colorScheme: "dark" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#d3f000"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(211,240,0,0.08)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
              </div>
              {errors.dueDate && <p className="mt-1 text-[11px] text-red-400">{errors.dueDate}</p>}
            </div>

            {/* Team Members */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-3">
                <Users size={12} /> Team Members
              </label>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((m) => (
                  <button key={m} type="button" onClick={() => toggleMember(m)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all"
                    style={selectedMembers.includes(m)
                      ? { backgroundColor: "#d3f000", color: "#000", borderColor: "#d3f000" }
                      : { backgroundColor: "#181818", color: "#555555", borderColor: "#2a2a2a" }
                    }
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]" style={{ backgroundColor: selectedMembers.includes(m) ? "#000" : "#2a2a2a", color: selectedMembers.includes(m) ? "#d3f000" : "#555555" }}>
                      {m.charAt(0)}
                    </span>
                    {m.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "#2a2a2a" }}>
              <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-lg border text-[13px] font-bold text-[#555555] hover:text-white transition-colors" style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}>
                Cancel
              </button>
              <button id="submit-project" type="submit" disabled={loading} className="flex-1 py-3 rounded-lg text-[13px] font-black text-black transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: "#d3f000" }}>
                {loading ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Creating...</> : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
