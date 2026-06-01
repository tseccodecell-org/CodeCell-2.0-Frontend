"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  dropdownItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "HOME", href: "/" },
  {
    label: "EVENTS",
    href: "/events",
    dropdownItems: [
      { label: "TSEC HACKS", href: "/tsec-hacks" },
      { label: "WEEKLY CHALLENGES", href: "/challenges" },
    ],
  },
  { label: "ABOUT US", href: "/about-us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === label ? null : label);
  };

  // Scroll listener to update progress bar and backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 2px tall scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#4BE2C4] to-[#E8FF00] z-[9999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={`
          sticky
          top-0
          left-0
          z-50
          w-full
          transition-all
          duration-300
          border-b
        `}
        style={{
          backgroundColor: scrolled ? "rgba(13,13,13,0.92)" : "transparent",
          borderColor: scrolled ? "var(--color-border)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          {/* =====================================
              LOGO / BRAND
          ===================================== */}
          <Link
            href="/"
            className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] font-bold text-[#F0EDE6] hover:text-[#E8FF00] transition-colors duration-200"
          >
            <Image
              src="/logo.png"
              alt="TSEC CodeCell Logo"
              width={34}
              height={34}
              className="object-contain"
              priority
            />
            <span className="terminal-cursor">TSEC CODECELL</span>
          </Link>

          {/* =====================================
              DESKTOP NAV
          ===================================== */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const activeColor = isEven ? "#E8FF00" : "#4BE2C4";
              const activeClass = isEven ? "text-[#E8FF00]" : "text-[#4BE2C4]";

              if (item.dropdownItems) {
                const isSubActive = item.dropdownItems.some((sub) => pathname === sub.href);

                return (
                  <div
                    key={item.label}
                    className="relative py-2 group"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`
                        flex
                        items-center
                        gap-1
                        font-mono
                        text-[12px]
                        font-bold
                        tracking-[0.15em]
                        transition-colors
                        duration-200
                        cursor-pointer
                        ${isSubActive ? activeClass : "text-[#F0EDE6]"}
                      `}
                      style={{
                        color: isSubActive ? activeColor : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubActive) e.currentTarget.style.color = activeColor;
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubActive) e.currentTarget.style.color = "#F0EDE6";
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <span
                      className={`
                        absolute
                        bottom-0
                        left-0
                        h-[1.5px]
                        transition-all
                        duration-300
                        ${isSubActive ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                      style={{
                        backgroundColor: activeColor,
                      }}
                    />

                    {/* Dropdown Menu */}
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#0D0D0D] border border-[#2A2A2A] py-2 flex flex-col z-[1000] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md bg-opacity-95">
                        {item.dropdownItems.map((subItem) => {
                          const isSubItemActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className={`
                                px-4
                                py-2.5
                                text-[10px]
                                font-mono
                                font-bold
                                tracking-wider
                                transition-colors
                                duration-200
                                border-l-2
                                ${
                                  isSubItemActive
                                    ? "text-[#E8FF00] border-[#E8FF00] bg-[#141414]"
                                    : "text-[#4A4A4A] border-transparent hover:text-[#F0EDE6] hover:bg-[#141414] hover:border-[#4BE2C4]"
                                }
                              `}
                            >
                              [ {subItem.label} ]
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    relative
                    py-2
                    font-mono
                    text-[12px]
                    font-bold
                    tracking-[0.15em]
                    transition-colors
                    duration-200
                    group
                    ${isActive ? activeClass : "text-[#F0EDE6]"}
                  `}
                  style={{
                    color: isActive ? activeColor : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = activeColor;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#F0EDE6";
                  }}
                >
                  {item.label}
                  <span
                    className={`
                      absolute
                      bottom-0
                      left-0
                      h-[1.5px]
                      transition-all
                      duration-300
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                    style={{
                      backgroundColor: activeColor,
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* =====================================
              DESKTOP LOGIN BUTTON
          ===================================== */}
          <div className="hidden lg:block">
            <Link href="/login">
              <button
                className="
                  btn-sweep
                  border
                  border-[#222222]
                  px-6
                  py-2
                  font-mono
                  text-xs
                  font-bold
                  tracking-[0.15em]
                  text-[#F0EDE6]
                  bg-transparent
                "
              >
                [ LOGIN ]
              </button>
            </Link>
          </div>

          {/* =====================================
              MOBILE HAMBURGER
          ===================================== */}
          <button
            onClick={() => setOpen(!open)}
            className="
              lg:hidden
              p-2
              text-[#F0EDE6]
              hover:text-[#4BE2C4]
              transition-colors
            "
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* =====================================
            MOBILE EXPANDING MENU (Downwards)
        ===================================== */}
        {open && (
          <div
            className="
              lg:hidden
              border-b
              border-[#4BE2C4]
              px-8
              py-8
              bg-[#0D0D0D]
            "
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, index) => {
                const isEven = index % 2 === 0;
                const activeColor = isEven ? "text-[#E8FF00]" : "text-[#4BE2C4]";

                if (item.dropdownItems) {
                  const isSubActive = item.dropdownItems.some((sub) => pathname === sub.href);
                  const isMobileOpen = mobileDropdownOpen === item.label;

                  return (
                    <div
                      key={item.label}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      className={`
                        flex
                        flex-col
                        transition-all
                        duration-300
                        transform
                        border-b
                        border-[#161616]
                        pb-2
                        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                      `}
                    >
                      <button
                        onClick={() => toggleMobileDropdown(item.label)}
                        className={`
                          font-mono
                          text-xs
                          font-bold
                          tracking-[0.15em]
                          py-2
                          h-[32px]
                          flex
                          items-center
                          justify-between
                          w-full
                          cursor-pointer
                          ${isSubActive ? activeColor : "text-[#F0EDE6] hover:text-[#E8FF00]"}
                        `}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            isMobileOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isMobileOpen && (
                        <div className="pl-4 flex flex-col gap-3 mt-2 font-mono text-[11px]">
                          {item.dropdownItems.map((subItem) => {
                            const isSubItemActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                onClick={() => setOpen(false)}
                                className={`
                                  py-1.5
                                  font-bold
                                  tracking-wider
                                  transition-colors
                                  ${isSubItemActive ? "text-[#E8FF00]" : "text-[#4A4A4A] hover:text-[#F0EDE6]"}
                                `}
                              >
                                [ {subItem.label} ]
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    className={`
                      font-mono
                      text-xs
                      font-bold
                      tracking-[0.15em]
                      py-2
                      border-b
                      border-[#161616]
                      h-[32px]
                      flex
                      items-center
                      transition-all
                      duration-300
                      transform
                      ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                      ${isActive ? activeColor : "text-[#F0EDE6] hover:text-[#E8FF00]"}
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                style={{ transitionDelay: `${navItems.length * 50}ms` }}
                className={`
                  w-full
                  transition-all
                  duration-300
                  transform
                  ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                `}
              >
                <button
                  className="
                    w-full
                    btn-sweep
                    border
                    border-[#222222]
                    py-3
                    font-mono
                    text-xs
                    font-bold
                    tracking-[0.15em]
                    text-[#F0EDE6]
                  "
                >
                  [ LOGIN ]
                </button>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}