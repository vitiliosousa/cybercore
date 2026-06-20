"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Calendar, User, AlignLeft, Tag } from "lucide-react";
import { useAppStore, TaskStatus, TaskPriority } from "@/lib/store";

interface TaskModalProps {
  projectId: string;
  initialStatus?: TaskStatus;
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskModal = ({
  projectId,
  initialStatus = "todo",
  onClose,
  onSuccess,
}: TaskModalProps) => {
  const { addTask, teamMembers } = useAppStore();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: initialStatus,
    priority: "medium" as TaskPriority,
    assignee: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Título da tarefa é obrigatório.";
    if (!form.assignee) e.assignee = "Seleccione um responsável.";
    if (!form.dueDate) e.dueDate = "Data limite é obrigatória.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await addTask(projectId, {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        assignee: form.assignee,
        dueDate: form.dueDate,
      });
      onSuccess();
    } catch {
      setErrors({ form: "Não foi possível criar a tarefa." });
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-lg border text-[13px] text-white outline-none transition-all";
  const inputStyle = { backgroundColor: "#181818", borderColor: "#2a2a2a" };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="w-full max-w-lg rounded-xl border overflow-hidden bg-bg-card border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">
              Nova Tarefa
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">
              Defina os detalhes da nova tarefa.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-bg-card transition-colors"
          >
            <X size={14} className="text-text-muted" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto"
        >
          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
              Título da Tarefa
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
              style={inputStyle}
              placeholder="ex: Desenhar UI do Dashboard"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
              Descrição
            </label>
            <div className="relative">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className={`${inputCls} resize-none pl-10`}
                style={inputStyle}
                placeholder="Breve descrição da tarefa..."
              />
              <AlignLeft
                size={14}
                className="absolute left-3 top-3.5 text-text-muted pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as TaskStatus,
                    })
                  }
                  className={`${inputCls} appearance-none pr-8`}
                  style={{ ...inputStyle, backgroundColor: "#181818" }}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
                Prioridade
              </label>
              <div className="relative">
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as TaskPriority,
                    })
                  }
                  className={`${inputCls} appearance-none pr-8`}
                  style={{ ...inputStyle, backgroundColor: "#181818" }}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
                Responsável
              </label>
              <div className="relative">
                <select
                  value={form.assignee}
                  onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                  className={`${inputCls} appearance-none pr-8 pl-10`}
                  style={{ ...inputStyle, backgroundColor: "#181818" }}
                >
                  <option value="">Seleccionar...</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
              {errors.assignee && (
                <p className="mt-1 text-[11px] text-red-400">{errors.assignee}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
                Data Limite
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className={`${inputCls} pr-10`}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
                <Calendar
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-[11px] text-red-400">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div
            className="flex gap-3 pt-2 border-t"
            style={{ borderColor: "#2a2a2a" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border text-[13px] font-bold text-text-muted hover:text-white transition-colors bg-bg-input border-border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg text-[13px] font-black text-black transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 bg-accent"
            >
              {loading ? "A criar..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
