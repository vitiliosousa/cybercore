"use client";

import Link from "next/link";
import { UserCircle, Settings, HelpCircle, LogOut } from "lucide-react";

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: {
    name: string;
    email: string;
  };
}

export const UserDropdown = ({
  isOpen,
  onClose,
  onLogout,
  user,
}: UserDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border overflow-hidden z-50"
      style={{
        backgroundColor: "#1a1a1a",
        borderColor: "#2a2a2a",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="px-3 py-2.5 border-b" style={{ borderColor: "#2a2a2a" }}>
        <p className="text-[12px] font-semibold text-white truncate">
          {user.name}
        </p>
        <p className="text-[10px] text-text-muted truncate">{user.email}</p>
      </div>
      <div className="py-1">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all"
        >
          <UserCircle size={13} />
          <span>Ver Perfil</span>
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all"
        >
          <Settings size={13} />
          <span>Definições</span>
        </Link>
        <Link
          href="/help"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-white hover:bg-bg-card transition-all"
        >
          <HelpCircle size={13} />
          <span>Ajuda</span>
        </Link>
        <div className="border-t my-1" style={{ borderColor: "#2a2a2a" }} />
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary hover:text-red-400 hover:bg-bg-card transition-all w-full text-left"
        >
          <LogOut size={13} />
          <span>Terminar Sessão</span>
        </button>
      </div>
    </div>
  );
};
