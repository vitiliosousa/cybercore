"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { UserDropdown } from "./UserDropdown";

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
  const { setAuthenticated, currentUser } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // derive display values from token payload
  const user = {
    name: currentUser?.name ?? "Utilizador",
    email: currentUser?.email ?? "",
    role: currentUser?.role ?? ""
  };

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
        <UserDropdown
          isOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onLogout={handleLogout}
          user={user}
        />

        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-bg-card transition-all w-full text-left group"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-black text-[10px] font-black shrink-0 bg-accent">
            {getInitials(user.name)}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-semibold text-white truncate leading-tight">
              {user.name}
            </span>
            <span className="text-[10px] text-text-muted truncate leading-tight">
              {user.role}
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
