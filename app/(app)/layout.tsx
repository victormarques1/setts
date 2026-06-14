import { AppChromeProvider } from "@/components/layout/app-chrome-context";
import { AppMain } from "@/components/layout/app-main";
import { AppNavbar } from "@/components/layout/app-navbar";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { auth } from "@/lib/auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <AppChromeProvider>
      <NavigationProgress />
      <div className="flex min-h-full flex-1 flex-col">
        <AppNavbar userName={session?.user?.name} />
        <AppMain>{children}</AppMain>
      </div>
    </AppChromeProvider>
  );
}
