import Image from "next/image";

export const SidebarLogo = () => (
  <div className="px-4 py-4 border-b border-border-light">
    <div className="flex items-center gap-2.5">
      <Image src={"/CyberCoreLogo.svg"} alt="CyberCore Logo" width={30} height={30} />
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
