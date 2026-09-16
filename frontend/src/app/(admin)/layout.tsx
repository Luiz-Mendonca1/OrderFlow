import { requiredAdmin } from "@/lib/auth";
import { Sidebar } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requiredAdmin();

  return (
    <div>
    <Sidebar />
      <main className="min-h-screen bg-background">{children}</main>
    </div>
  );
}