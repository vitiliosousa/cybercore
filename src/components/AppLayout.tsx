"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto p-6"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        {children}
      </main>
    </div>
  );
}
