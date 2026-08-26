import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUserRecord } from "@/lib/auth";

export async function Navbar() {
  const user = await getCurrentUserRecord();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full overflow-hidden bg-transparent">
            <img src="/labhsetuLogo.png" alt="LabhSetu Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-serif text-2xl text-stone-900">LabhSetu</p>
            <p className="text-xs text-stone-500">Built for Bharat</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-stone-600 md:flex">
          <Link href="/finder">Finder</Link>
          <Link href="/schemes">Browse Schemes</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Badge className="hidden border-india-green/20 bg-green-50 text-india-green md:inline-flex">
            AI Ready
          </Badge>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
