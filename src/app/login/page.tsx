"use client";

import { BrandingPanel } from "./components/BrandingPanel";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Left — Branding Panel */}
      <BrandingPanel />

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}
