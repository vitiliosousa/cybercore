import { Zap } from "lucide-react";

export const SidebarLogo = () => (
  <div className="px-4 py-4 border-b border-border-light">
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-accent">
        <Zap size={14} className="text-black" />
      </div>
      <div>
        <p className="text-[11px] font-bold tracking-[0.15em] text-white uppercase">
          CyberCore
        </p>
        <p className="text-[9px] tracking-widest uppercase text-text-muted">
          MozCyber
        </p>
      </div>
    </div>
  </div>
);
