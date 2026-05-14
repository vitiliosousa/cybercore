"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Zap, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/api/auth/fetches";

export const LoginForm = () => {
  const router = useRouter();
  const { setAuthenticated } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: mock login
  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");
  //   await new Promise((r) => setTimeout(r, 800));
  //   if (email) {
  //     setAuthenticated(true);
  //     router.push("/dashboard");
  //   } else {
  //     setError("Credenciais inválidas.");
  //     setLoading(false);
  //   }
  // };

  // live login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = await loginUser({ email, password });

    if (token) {
      localStorage.setItem("cybercore_token", token);
      setAuthenticated(true);
      router.push("/dashboard");
    } else {
      setError("Credenciais inválidas.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Mobile logo */}
      <div className="flex items-center gap-3 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent">
          <Zap size={16} className="text-black" />
        </div>
        <p className="text-white text-xs font-bold tracking-widest uppercase">
          CyberCore
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-accent" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
            Acesso ao Sistema
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Bem-vindo de volta
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Introduza as credenciais para iniciar sessão segura.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-1.5">
            Endereço de Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm text-white border outline-none transition-all bg-bg-input border-border"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#d3f000";
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(211,240,0,0.1)";
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
              Palavra-passe
            </label>
            <Link
              href={"/dashboard"}
              type="button"
              className="text-[11px] hover:text-white transition-colors text-accent"
            >
              Esqueceu o acesso?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg text-sm text-white border outline-none transition-all bg-bg-input border-border"
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
          className="w-full py-3 rounded-lg text-sm font-black text-black tracking-wider transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2 hover:opacity-90 bg-accent"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              A AUTENTICAR...
            </>
          ) : (
            "INICIAR SESSÃO SEGURA"
          )}
        </button>
      </form>
      <div className="mt-8 flex items-center gap-2 pt-6 border-t border-border-light">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-accent"
              style={{ backgroundColor: "#d3f000", opacity: 0.4 + i * 0.3 }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[#333333] font-mono tracking-widest uppercase">
          Autenticação de Hardware Activa
        </span>
      </div>
    </div>
  );
};
