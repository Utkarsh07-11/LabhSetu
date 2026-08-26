import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { SiteShell } from "@/components/layout/site-shell";
import { getCurrentAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin");
  }

  return (
    <SiteShell>
      <section className="container-shell py-14">
        <AdminLoginForm />
      </section>
    </SiteShell>
  );
}
