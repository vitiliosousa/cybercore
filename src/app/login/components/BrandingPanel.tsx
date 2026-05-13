import Image from "next/image";

const StatusReadouts = () => (
  <div className="flex flex-col gap-2">
    {[
      ["BOOT_SEQUENCE", "OK"],
      ["NETWORK_ENCRYPTION", "AES_256"],
      ["CORE_LATENCY", "4ms"],
      ["UPTIME", "99.9997%"],
    ].map(([k, v]) => (
      <div key={k} className="flex items-center gap-2 font-mono text-[11px]">
        <span className="text-accent">&gt;</span>
        <span className="text-[#333333]">{k}:</span>
        <span className="font-bold text-accent">{v}</span>
      </div>
    ))}
  </div>
);
export const BrandingPanel = () => {
  return (
    <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden bg-[#0d0d0d] border-r border-border-light">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#d3f000 1px, transparent 1px), linear-gradient(90deg, #d3f000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-accent" />
      <div className="relative z-10 p-10">
        <div className="flex items-center gap-3">
          <Image
            src={"/CyberCoreLogo.svg"}
            alt="CyberCore Logo"
            width={36}
            height={36}
          />
          <div>
            <p className="text-white text-[11px] font-bold tracking-[0.2em] uppercase">
              CyberCore
            </p>
            <p className="text-text-muted text-[9px] tracking-widest uppercase">
              Mozcyber
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
        <h2 className="text-5xl font-black text-white leading-none mb-6 tracking-tight">
          GERIR
          <br />
          <span className="text-accent">PROJECTOS</span>
          <br />
          EM ESCALA.
        </h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-xs">
          O CyberCore unifica as suas equipas, tarefas e cronogramas num
          poderoso centro de comando.
        </p>
      </div>
      <div className="relative z-10 p-10 border-t border-border-light">
        <StatusReadouts />
      </div>
    </div>
  );
};
