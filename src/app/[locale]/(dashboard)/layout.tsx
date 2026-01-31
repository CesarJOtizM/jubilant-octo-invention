import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will go here */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold">Nevada Inventory</span>
        </div>
        <nav className="p-4">{/* Navigation items will go here */}</nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Header will go here */}
        <header className="flex h-14 items-center border-b px-4">
          {/* Header content */}
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
