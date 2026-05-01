"use client";

import AppLayout from "@/components/AppLayout";
import { ProjectHeader } from "./components/ProjectHeader";

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <ProjectHeader />
        {children}
      </div>
    </AppLayout>
  );
}
