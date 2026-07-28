"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  console.log("FOOTER WRAPPER PATHNAME:", pathname);

  const hideFooter =
    pathname.startsWith("/events/weekly-challenges/solve") ||
    pathname.startsWith("/terminal");

  console.log("HIDE FOOTER?", hideFooter);

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}