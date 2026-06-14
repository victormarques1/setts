import { LoginForm } from "@/modules/auth/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-muted-foreground">
          Faça login para acessar seus treinos.
        </p>
      </div>
      <LoginForm callbackUrl={callbackUrl ?? "/workouts"} />
    </div>
  );
}
