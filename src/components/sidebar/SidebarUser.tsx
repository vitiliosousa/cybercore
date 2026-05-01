"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const MOCK_USER = {
  name: "Vitilio Sousa",
  email: "vitilio@mozcyber.io",
  role: "Administrador",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const SidebarUser = () => {
  const router = useRouter();
  const { setAuthenticated } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="px-2 pb-3 pt-2 flex flex-col gap-0.5">
      <div
        className="mt-2 pt-2 border-t border-border-light relative"
        ref={dropdownRef}
      >
        {dropdownOpen && (
          <div
            className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border overflow-hidden"
            style={{
              backgroundColor: "#1a1a1a",
              borderColor: "#2a2a2a",
              boxShadow: "0 -8px 24px rgba(0,0,0,0.4)",
            }}
          >
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
                href="/help"
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

        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-bg-card transition-all w-full text-left group"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-black text-[10px] font-black shrink-0 bg-accent">
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
  );
};
