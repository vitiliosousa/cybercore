"use client";

import AppLayout from "@/components/AppLayout";
import { useAppStore, Task, TaskPriority } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, ChevronDown, Calendar } from "lucide-react";

const teamMembers = ["Sarah Jenkins", "David Chen", "Elena Rodriguez", "Mike Ross", "Anya Patel", "James Liu"];

function CreateTaskForm() {
  const { isAuthenticated, projects, addTask } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("project") ?? "";

  const [form, setForm] = useState({ title: "", description: "", projectId: preselected, assignee: "", priority: "medium" as TaskPriority, dueDate: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, [isAuthenticated, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Task title is required.";
    if (!form.projectId) e.projectId = "Please select a project.";
    if (!form.assignee) e.assignee = "Please assign a team member.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const task: Task = { id: `t${Date.now()}`, title: form.title, description: form.description, status: "todo", priority: form.priority, assignee: form.assignee, dueDate: form.dueDate || new Date().toISOString().slice(0, 10), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    addTask(form.projectId, task);
    router.push(form.projectId ? `/projects/${form.projectId}/kanban` : "/projects");
  };

  if (!isAuthenticated) return null;

  const inputCls = "w-full px-4 py-3 rounded-lg border text-[13px] text-white outline-none transition-all";
  const inputStyle = { backgroundColor: "#181818", borderColor: "#2a2a2a" };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = "#d3f000"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(211,240,0,0.08)"; };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.boxShadow = "none"; };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[12px] text-[#555555] hover:text-white mb-6 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "#2a2a2a" }}>
          <h1 className="text-base font-black text-white tracking-tight">Create New Task</h1>
          <p className="text-[12px] text-[#555555] mt-1">Add a task to a project and assign it to a team member.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Project */}
          <div>
            <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Project</label>
            <div className="relative">
              <select id="task-project" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className={`${inputCls} appearance-none pr-8`} style={{ ...inputStyle, backgroundColor: "#181818" }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Select project...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
            </div>
            {errors.projectId && <p className="mt-1 text-[11px] text-red-400">{errors.projectId}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Task Title</label>
            <input id="task-title" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} style={inputStyle} placeholder="e.g. Implement OAuth2 layer" onFocus={onFocus} onBlur={onBlur} />
            {errors.title && <p className="mt-1 text-[11px] text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Description</label>
            <textarea id="task-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputCls} resize-none`} style={inputStyle} placeholder="What needs to be done..." onFocus={onFocus} onBlur={onBlur} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Assignee</label>
              <div className="relative">
                <select id="task-assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} className={`${inputCls} appearance-none pr-8`} style={{ ...inputStyle, backgroundColor: "#181818" }} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">Assign to...</option>
                  {teamMembers.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
              </div>
              {errors.assignee && <p className="mt-1 text-[11px] text-red-400">{errors.assignee}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Priority</label>
              <div className="relative">
                <select id="task-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })} className={`${inputCls} appearance-none pr-8`} style={{ ...inputStyle, backgroundColor: "#181818" }} onFocus={onFocus} onBlur={onBlur}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Due Date</label>
              <div className="relative">
                <input id="task-due-date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className={`${inputCls} pr-10`} style={{ ...inputStyle, colorScheme: "dark" }} onFocus={onFocus} onBlur={onBlur} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[10px] font-black text-[#555555] uppercase tracking-[0.15em] mb-1.5">Tags (comma-separated)</label>
              <input id="task-tags" type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} style={inputStyle} placeholder="backend, api, testing" onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "#2a2a2a" }}>
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-lg border text-[13px] font-bold text-[#555555] hover:text-white transition-colors" style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}>
              Cancel
            </button>
            <button id="submit-task" type="submit" disabled={loading} className="flex-1 py-3 rounded-lg text-[13px] font-black text-black transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: "#d3f000" }}>
              {loading ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Creating...</> : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateTaskPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6 text-[#555555] text-sm">Loading...</div>}>
        <CreateTaskForm />
      </Suspense>
    </AppLayout>
  );
}
