export const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
export const MESES_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const DIAS_SEMANA = ["D","S","T","Q","Q","S","S"];
export const COL_W  = 36;
export const ROW_H  = 44;

export const STATUS_COLOR: Record<string, string> = {
  todo:        "#3a3a3a",
  in_progress: "#3b82f6",
  review:      "#8b5cf6",
  done:        "#d3f000",
};

export const STATUS_LABEL: Record<string, string> = {
  todo:        "A Fazer",
  in_progress: "Em Progresso",
  review:      "Em Revisão",
  done:        "Concluído",
};

export const PRIORITY_COLOR: Record<string, string> = {
  low:      "#22c55e",
  medium:   "#f59e0b",
  high:     "#f97316",
  critical: "#ef4444",
};

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function diffDays(a: Date, b: Date) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}
