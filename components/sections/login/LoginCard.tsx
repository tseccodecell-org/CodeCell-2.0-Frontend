"use client";

export default function LoginCard() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <button
      onClick={() => (window.location.href = `${BASE_URL}/oauth/google/login`)}
      className="px-10 py-4 rounded-full bg-black border-2 border-[#f59e0b] text-[#f59e0b] font-mono font-black text-xs md:text-sm uppercase tracking-[0.25em] hover:bg-[#f59e0b]/10 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3 group"
    >
      <span>LOGIN</span>
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </button>
  );
}