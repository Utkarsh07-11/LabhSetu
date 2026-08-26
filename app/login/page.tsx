import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { SiteShell } from "@/components/layout/site-shell";
import { getCurrentUserRecord } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUserRecord();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <SiteShell>
      <section className="container-shell py-14">
        <AuthForm mode="login" />
      </section>
    </SiteShell>
  );
}
