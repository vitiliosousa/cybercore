import { Circle, Clock3, AlertCircle, CheckCircle2 } from "lucide-react";

export const STATUS_STYLE: Record<string, string> = {
  todo:        "#555555",
  in_progress: "#3b82f6",
  review:      "#8b5cf6",
  done:        "#d3f000",
};

export const STATUS_MAP: Record<string, string> = {
  todo:        "A Fazer",
  in_progress: "Em Progresso",
  review:      "Em Revisão",
  done:        "Concluído",
};

export const STATUS_ICONS: Record<string, React.ElementType> = {
  todo:        Circle,
  in_progress: Clock3,
  review:      AlertCircle,
  done:        CheckCircle2,
};

export const PRIORITY_STYLE: Record<string, { color: string; bg: string }> = {
  low:      { color: "#555555", bg: "rgba(85,85,85,0.12)"   },
  medium:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  high:     { color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)"  },
};

export const PRIORITY_MAP: Record<string, string> = {
  low:      "Baixa",
  medium:   "Média",
  high:     "Alta",
  critical: "Crítica",
};

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "—";
  
  // The API might return DD/MM/YYYY HH:MM or ISO
  if (dateStr.includes("/")) {
    const [datePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${day} ${MESES[parseInt(month) - 1]}`;
  }

  if (dateStr.includes("-")) {
    const [year, month, dayPart] = dateStr.split("-");
    const day = dayPart.split("T")[0];
    return `${day} ${MESES[parseInt(month) - 1]}`;
  }

  return dateStr;
}

export function getDaysLeft(dueDate: string): number {
  return Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
}
