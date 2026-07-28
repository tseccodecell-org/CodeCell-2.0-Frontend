"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import InteractiveGrid from "@/components/layout/InteractiveGrid";

const BARE_ROUTES = ["/events/weekly-challenges/solve"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((route) => pathname?.startsWith(route));

  if (bare) {
    return <main className="relative z-10">{children}</main>;
  }

  return (
    <>
      <InteractiveGrid />
      <Navbar />
      <main className="relative z-10 min-h-screen">{children}</main>
      <FooterWrapper />
    </>
  );
}
