"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import InteractiveGrid from "@/components/layout/InteractiveGrid";
import AccountStatusBanner from "@/components/layout/AccountStatusBanner";
import NotificationPopup from "@/components/layout/NotificationPopup";
import RegistrationGate from "@/components/layout/RegistrationGate";

const BARE_ROUTES = ["/events/weekly-challenges/solve", "/events/finale/workspace"];
const IMMERSIVE_ROUTES = ["/events/finale/contest"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((route) => pathname?.startsWith(route));
  const immersive = IMMERSIVE_ROUTES.some((route) => pathname?.startsWith(route));

  if (bare) {
    return (
      <RegistrationGate>
        <div className="flex h-screen flex-col">
          <AccountStatusBanner compact />
          <NotificationPopup />
          <main className="relative z-10 min-h-0 flex-1">{children}</main>
        </div>
      </RegistrationGate>
    );
  }

  if (immersive) {
    return (
      <RegistrationGate>
        <AccountStatusBanner compact />
        <NotificationPopup />
        <main className="relative z-10 min-h-screen">{children}</main>
      </RegistrationGate>
    );
  }

  return (
    <RegistrationGate>
      <InteractiveGrid />
      <Navbar />
      <AccountStatusBanner />
      <NotificationPopup />
      <main className="relative z-10 min-h-screen">{children}</main>
      <FooterWrapper />
    </RegistrationGate>
  );
}
