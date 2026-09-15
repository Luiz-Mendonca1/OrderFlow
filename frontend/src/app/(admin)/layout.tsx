import { requiredAdmin } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requiredAdmin();

  return <main className="min-h-screen bg-background">{children}</main>;
}