"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "CHALLENGES", href: "/challenges" },
  { label: "EVENTS", href: "/events" },
  { label: "TSEC HACKS", href: "/tsec-hacks" },
  { label: "LEADERBOARD", href: "/leaderboard" }
  // { label: "ABOUT US", href: "/about-us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        fixed
        top-0
        left-0
        z-50
        w-full
        border-b
        backdrop-blur-xl
      "
      style={{
        background: "color-mix(in oklab, var(--surface) 88%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex h-20 items-center justify-between px-4 md:px-8">

        {/* =====================================
            LOGO
        ===================================== */}

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="TSEC CodeCell"
            width={58}
            height={58}
            priority
            className="pixelated object-contain"
          />

          <div className="hidden sm:flex flex-col leading-none">
            <span
              className="text-[15px] font-bold tracking-[0.25em]"
              style={{
                color: "var(--gold)",
              }}
            >
              TSEC
            </span>

            <span
              className="text-[15px] font-bold tracking-[0.2em]"
              style={{
                color: "var(--mint)",
              }}
            >
              CODECELL
            </span>
          </div>
        </Link>

        {/* =====================================
            DESKTOP NAV
        ===================================== */}

        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="
                text-sm
                font-semibold
                tracking-[0.18em]
                transition-all
                duration-200
              "
              style={{
                color: "var(--foreground)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--mint)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--foreground)";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* =====================================
            DESKTOP LOGIN BUTTON
        ===================================== */}

        <div className="hidden lg:block">
          <button
            className="
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-200
              hover:scale-[1.03]
            "
            style={{
              background: "var(--gradient-mint)",
              color: "var(--mint-foreground)",
              boxShadow: "var(--shadow-mint)",
            }}
          >
            Login
          </button>
        </div>

        {/* =====================================
            MOBILE HAMBURGER
        ===================================== */}

        <button
          onClick={() => setOpen(!open)}
          className="
            lg:hidden
            rounded-xl
            p-2
            transition
          "
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* =====================================
          MOBILE MENU
      ===================================== */}

      {open && (
        <div
          className="
            lg:hidden
            border-t
            px-6
            py-6
            backdrop-blur-2xl
          "
          style={{
            background:
              "color-mix(in oklab, var(--surface-elevated) 92%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="
                  rounded-xl
                  px-4
                  py-4
                  text-sm
                  font-semibold
                  tracking-[0.15em]
                  transition-all
                  duration-200
                "
                style={{
                  color: "var(--foreground)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "color-mix(in oklab, var(--mint) 10%, transparent)";

                  e.currentTarget.style.color = "var(--mint)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";

                  e.currentTarget.style.color = "var(--foreground)";
                }}
              >
                {item.label}
              </Link>
            ))}

            <button
              className="
                mt-4
                rounded-xl
                px-5
                py-3
                text-sm
                font-semibold
              "
              style={{
                background: "var(--gradient-mint)",
                color: "var(--mint-foreground)",
                boxShadow: "var(--shadow-mint)",
              }}
            >
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}