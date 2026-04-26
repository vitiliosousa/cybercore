"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthenticated } = useAppStore();
  const [email, setEmail] = useState("admin@cyber.io");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    if (email) {
      setAuthenticated(true);
      router.push("/dashboard");
    } else {
      setError("Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Left — Branding Panel */}
      <div
        className="hidden lg:flex w-1/2 flex-col relative overflow-hidden border-r border-border-light"
        style={{ backgroundColor: "#0d0d0d" }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#d3f000 1px, transparent 1px), linear-gradient(90deg, #d3f000 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow blob */}
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: "#d3f000" }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#d3f000" }}
            >
              <Zap size={18} className="text-black" />
            </div>
            <div>
              <p className="text-white text-[11px] font-bold tracking-[0.2em] uppercase">
                CyberCore
              </p>
              <p className="text-text-muted text-[9px] tracking-widest uppercase">
                Autonomous Infrastructure
              </p>
            </div>
          </div>
        </div>

        {/* Main headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
          <h2 className="text-5xl font-black text-white leading-none mb-6 tracking-tight">
            MANAGE
            <br />
            <span style={{ color: "#d3f000" }}>PROJECTS</span>
            <br />
            AT SCALE.
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            CyberCore unifies your teams, tasks and timelines into one powerful
            command center.
          </p>
        </div>

        {/* Status readouts */}
        <div className="relative z-10 p-10 border-t border-border-light">
          <div className="flex flex-col gap-2">
            {[
              ["BOOT_SEQUENCE", "OK"],
              ["NETWORK_ENCRYPTION", "AES_256"],
              ["CORE_LATENCY", "4ms"],
              ["UPTIME", "99.9997%"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-2 font-mono text-[11px]"
              >
                <span style={{ color: "#d3f000" }}>&gt;</span>
                <span className="text-[#333333]">{k}:</span>
                <span style={{ color: "#d3f000" }} className="font-bold">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#d3f000" }}
            >
              <Zap size={16} className="text-black" />
            </div>
            <p className="text-white text-xs font-bold tracking-widest uppercase">
              CyberCore
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#d3f000" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "#d3f000" }}
              >
                System Access
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Enter credentials to initiate secure session.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white border outline-none transition-all"
                style={{
                  backgroundColor: "#181818",
                  borderColor: "#2a2a2a",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#d3f000";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(211,240,0,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.boxShadow = "none";
                }}
                placeholder="admin@cyber.io"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] hover:text-white transition-colors"
                  style={{ color: "#d3f000" }}
                >
                  Forgot Access?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg text-sm text-white border outline-none transition-all"
                  style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#d3f000";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(211,240,0,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-black text-black tracking-wider transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2 hover:opacity-90"
              style={{ backgroundColor: "#d3f000" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                "INITIATE SECURE SESSION"
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 pt-6 border-t border-border-light">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: "#d3f000", opacity: 0.4 + i * 0.3 }}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#333333] font-mono tracking-widest uppercase">
              Hardware Authentication Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
