"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Users,
  BarChart3,
  HelpCircle,
  Zap,
  Folder,
  Settings,
  LogOut,
  UserCircle,
  ChevronUp,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

// ─── Utilizador fictício ───────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Amílcar Ubisse",
  email: "amilcar@mozcyber.io",
  role: "Administrador",
};

// ─── Itens de navegação ────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Projectos", icon: Folder, href: "/projects" },
  { label: "Tarefas", icon: CheckSquare, href: "/tasks" },
  { label: "Timeline", icon: CalendarDays, href: "/timeline" },
  { label: "Equipa", icon: Users, href: "/team" },
  { label: "Relatórios", icon: BarChart3, href: "/reports" },
];

const bottomItems = [
  { label: "Definições", icon: Settings, href: "/settings" },
  { label: "Ajuda", icon: HelpCircle, href: "/help" },
];

// ─── Utilitário: gerar iniciais ────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Componente ────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setAuthenticated } = useAppStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAuthenticated(false);
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      aria-label="Navegação principal"
      className="flex flex-col shrink-0 h-screen w-56 border-r border-border-light"
      style={{ backgroundColor: "#111111" }}
    >
      {/* ── Logo ── */}
      <div className="px-4 py-4 border-b border-border-light">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: "#d3f000" }}
          >
            <Zap size={14} className="text-black" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] text-white uppercase">
              CyberCore
            </p>
            <p
              className="text-[9px] tracking-widest uppercase"
              style={{ color: "#d3f000", opacity: 0.6 }}
            >
              MozCyber
            </p>
          </div>
        </div>
      </div>

      {/* ── Navegação principal ── */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "text-black font-semibold"
                  : "text-text-secondary hover:text-white hover:bg-bg-card"
              }`}
              style={active ? { backgroundColor: "#d3f000" } : {}}
            >
              <Icon
                size={15}
                className={active ? "text-black" : "text-current"}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Rodapé ── */}
      <div className="px-2 pb-3  pt-2 flex flex-col gap-0.5">
        {/* ── Avatar com dropdown ── */}
        <div
          className="mt-2 pt-2 border-t border-border-light relative"
          ref={dropdownRef}
        >
          {/* Dropdown — aparece acima do avatar */}
          {dropdownOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border overflow-hidden"
              style={{
                backgroundColor: "#1a1a1a",
                borderColor: "#2a2a2a",
                boxShadow: "0 -8px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Cabeçalho do dropdown */}
              <div
                className="px-3 py-2.5 border-b"
                style={{ borderColor: "#2a2a2a" }}
              >
                <p className="text-[12px] font-semibold text-white truncate">
                  {MOCK_USER.name}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {MOCK_USER.email}
                </p>
              </div>

              {/* Opções */}
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all"
                >
                  <UserCircle size={13} />
                  <span>Ver Perfil</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all"
                >
                  <Settings size={13} />
                  <span>Definições</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all"
                >
                  <HelpCircle size={13} />
                  <span>Ajuda</span>
                </Link>
                <div
                  className="border-t my-1"
                  style={{ borderColor: "#2a2a2a" }}
                />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-red-400 hover:bg-bg-card transition-all w-full text-left"
                >
                  <LogOut size={13} />
                  <span>Terminar Sessão</span>
                </button>
              </div>
            </div>
          )}

          {/* Botão do avatar */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-bg-card transition-all w-full text-left group"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-black text-[10px] font-black shrink-0"
              style={{ backgroundColor: "#d3f000" }}
            >
              {getInitials(MOCK_USER.name)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12px] font-semibold text-white truncate leading-tight">
                {MOCK_USER.name}
              </span>
              <span className="text-[10px] text-text-muted truncate leading-tight">
                {MOCK_USER.role}
              </span>
            </div>
            <ChevronUp
              size={12}
              className="text-text-muted shrink-0 transition-transform duration-200"
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
