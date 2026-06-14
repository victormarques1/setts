import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-24">
      <main className="flex w-full max-w-lg flex-col items-center gap-6 text-center sm:gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">weightzz</h1>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Registre treinos, séries, carga e repetições. Acompanhe sua
            progressão ao longo do tempo.
          </p>
        </div>
        {session?.user ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button className="w-full sm:w-auto" size="lg" render={<Link href="/workouts" />} nativeButton={false}>
              Meus treinos
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
