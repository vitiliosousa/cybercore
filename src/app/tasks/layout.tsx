"use client";

import AppLayout from "@/components/AppLayout";
import { TasksHeader } from "./components/TasksHeader";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <TasksHeader />
        {children}
      </div>
    </AppLayout>
  );
}
