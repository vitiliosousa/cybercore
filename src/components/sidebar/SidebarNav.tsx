import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Folder,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Projectos", icon: Folder, href: "/projects" },
  { label: "Tarefas", icon: CheckSquare, href: "/tasks" },
  { label: "Equipa", icon: Users, href: "/team" },
];

export const SidebarNav = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
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
  );
};
