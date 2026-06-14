import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Cadastro</h1>
        <p className="text-muted-foreground">
          Crie sua conta para começar a registrar sua progressão.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
