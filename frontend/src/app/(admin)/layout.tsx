  import { requiredUser } from "@/lib/auth";
  import { Sidebar } from "@/components/Sidebar";

  export default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    await requiredUser();

    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 pt-20 text-foreground md:p-8">
          {children}
        </main>
      </div>
    );
  }