import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <main className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">weightzz</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Registre treinos, séries, carga e repetições. Acompanhe sua
            progressão ao longo do tempo.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/workouts" />} nativeButton={false}>
            Meus treinos
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/history" />}
            nativeButton={false}
          >
            Histórico
          </Button>
        </div>
      </main>
    </div>
  );
}
