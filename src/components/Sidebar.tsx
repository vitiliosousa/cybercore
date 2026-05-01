"use client";

import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarUser } from "./sidebar/SidebarUser";

export default function Sidebar() {
  return (
    <aside
      aria-label="Navegação principal"
      className="flex flex-col shrink-0 h-screen w-56 border-r border-border-light bg-bg-sidebar"
    >
      <SidebarLogo />
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}
