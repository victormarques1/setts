import Link from "next/link";

import { AppLogo } from "@/components/layout/app-logo";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center shell-x py-10 sm:py-20">
      <main className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <AppLogo size="lg" />
          <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
            Registre cada série, acompanhe sua evolução e supere seus recordes
            de carga.
          </p>
        </div>
        {session?.user ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <Button className="w-full sm:w-auto" size="lg" render={<Link href="/workouts" />} nativeButton={false}>
              Meus treinos
            </Button>
            <Button
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
              render={<Link href="/progress" />}
              nativeButton={false}
            >
              Progressão
            </Button>
            <Button
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
              render={<Link href="/history" />}
              nativeButton={false}
            >
              Histórico
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button className="w-full sm:w-auto" size="lg" render={<Link href="/login" />} nativeButton={false}>
              Entrar
            </Button>
            <Button
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
              render={<Link href="/register" />}
              nativeButton={false}
            >
              Criar conta
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
