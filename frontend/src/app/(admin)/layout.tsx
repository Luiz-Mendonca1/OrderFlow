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
        <main className="flex-1 p-8 text-foreground">
          {children}
        </main>
      </div>
    );
  }