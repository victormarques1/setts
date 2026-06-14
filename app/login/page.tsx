import { LoginForm } from "@/modules/auth/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="page-shell-auth">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Entrar</h1>
        <p className="text-muted-foreground">
          Faça login para acessar seus treinos.
        </p>
      </div>
      <LoginForm callbackUrl={callbackUrl ?? "/workouts"} />
    </div>
  );
}
