"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Calendar, Users } from "lucide-react";
import { useAppStore, Project } from "@/lib/store";

const membrosEquipa = [
  "Sarah Jenkins",
  "David Chen",
  "Elena Rodriguez",
  "Mike Ross",
  "Anya Patel",
  "James Liu",
];

interface ProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ProjectModal = ({ onClose, onSuccess }: ProjectModalProps) => {
  const { addProject } = useAppStore();
  const [form, setForm] = useState({
    name: "",
    description: "",
    lead: "",
    dueDate: "",
    status: "active" as Project["status"],
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
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
    if (!form.name.trim()) e.name = "Nome do projecto é obrigatório.";
    if (!form.lead) e.lead = "Seleccione um responsável.";
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
      await addProject({
        name: form.name,
        description: form.description,
        status: form.status,
        lead: form.lead,
        dueDate: form.dueDate,
        members: selectedMembers.length ? selectedMembers : [form.lead],
      });
      onSuccess();
    } catch {
      setErrors({ form: "Não foi possível criar o projecto." });
      setLoading(false);
    }
  };

  const toggleMember = (m: string) =>
    setSelectedMembers((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

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
          {" "}
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">
              Novo Projecto
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">
              Preencha os dados para criar o projecto.
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
              Nome do Projecto
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              style={inputStyle}
              placeholder="ex: Sistema de Gestão MozCyber"
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
              Descrição
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className={`${inputCls} resize-none`}
              style={inputStyle}
              placeholder="Breve descrição do projecto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-1.5">
                Responsável
              </label>
              <div className="relative">
                <select
                  value={form.lead}
                  onChange={(e) => setForm({ ...form, lead: e.target.value })}
                  className={`${inputCls} appearance-none pr-8`}
                  style={{ ...inputStyle, backgroundColor: "#181818" }}
                >
                  <option value="">Seleccionar...</option>
                  {membrosEquipa.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
              {errors.lead && (
                <p className="mt-1 text-[11px] text-red-400">{errors.lead}</p>
              )}
            </div>

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
                      status: e.target.value as Project["status"],
                    })
                  }
                  className={`${inputCls} appearance-none pr-8`}
                  style={{ ...inputStyle, backgroundColor: "#181818" }}
                >
                  <option value="active">Activo</option>
                  <option value="on_hold">Em Pausa</option>
                  <option value="completed">Concluído</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
              </div>
            </div>
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

          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">
              <Users size={12} /> Membros da Equipa
            </label>
            <div className="flex flex-wrap gap-2">
              {membrosEquipa.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMember(m)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all"
                  style={
                    selectedMembers.includes(m)
                      ? {
                          backgroundColor: "#d3f000",
                          color: "#000",
                          borderColor: "#d3f000",
                        }
                      : {
                          backgroundColor: "#181818",
                          color: "#555555",
                          borderColor: "#2a2a2a",
                        }
                  }
                >
                  {m.split(" ")[0]}
                </button>
              ))}
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
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> A criar...
                </>
              ) : (
                "Criar Projecto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
