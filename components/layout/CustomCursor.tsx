"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef<HTMLSpanElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorSize = useRef({ w: 12, h: 12 });
  
  const [isVisible, setIsVisible] = useState(false);
  const isCodeHovered = useRef(false);
  const hoveredElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Detect mobile/tablet to disable custom cursor
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      document.body.style.cursor = "auto";
      return;
    }

    // Hide standard cursor globally on desktop
    document.body.style.cursor = "none";

    const updateMousePos = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if hovering clickable/interactive elements
      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], .interactive-hover'
      ) as HTMLElement | null;
      hoveredElement.current = interactive;

      // Check if hovering code blocks or consoles
      const isCode = target.closest(
        'pre, code, .code-console, [data-code-block="true"]'
      );
      isCodeHovered.current = !!isCode;
    };

    window.addEventListener("mousemove", updateMousePos, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);

    // LERP animation loop
    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    let curX = 0;
    let curY = 0;
    let curW = 12;
    let curH = 12;

    const animateCursor = () => {
      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;
      let targetW = 12;
      let targetH = 12;
      let isSnapped = false;

      // Snapping check
      if (hoveredElement.current) {
        const rect = hoveredElement.current.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        targetW = rect.width + 12;
        targetH = rect.height + 8;
        isSnapped = true;
      } else if (isCodeHovered.current) {
        targetW = 2;
        targetH = 18;
      }

      // LERP coordinates and size
      curX = lerp(curX, targetX, isSnapped ? 0.22 : 0.15);
      curY = lerp(curY, targetY, isSnapped ? 0.22 : 0.15);
      curW = lerp(curW, targetW, 0.2);
      curH = lerp(curH, targetH, 0.2);

      cursorPos.current = { x: curX, y: curY };
      cursorSize.current = { w: curW, h: curH };

      if (cursorRef.current) {
        // Set transform & sizes
        cursorRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
        cursorRef.current.style.width = `${curW}px`;
        cursorRef.current.style.height = `${curH}px`;

        // Styling based on state
        if (isSnapped) {
          cursorRef.current.style.backgroundColor = "rgba(75, 226, 196, 0.04)";
          cursorRef.current.style.borderColor = "#4BE2C4";
          cursorRef.current.style.borderRadius = "0px";
          cursorRef.current.style.borderWidth = "1.5px";
        } else if (isCodeHovered.current) {
          cursorRef.current.style.backgroundColor = "#E8FF00";
          cursorRef.current.style.borderColor = "transparent";
          cursorRef.current.style.borderRadius = "0px";
          cursorRef.current.style.borderWidth = "0px";
        } else {
          cursorRef.current.style.backgroundColor = "transparent";
          cursorRef.current.style.borderColor = "#E8FF00";
          cursorRef.current.style.borderRadius = "50%";
          cursorRef.current.style.borderWidth = "1.5px";
        }
      }

      // Direct DOM updates for HUD
      if (coordsRef.current) {
        coordsRef.current.textContent = `${Math.round(targetX)}, ${Math.round(targetY)}`;
      }
      if (modeRef.current) {
        modeRef.current.textContent = isSnapped
          ? "[LCK_SYS]"
          : isCodeHovered.current
          ? "[CODE]"
          : "[SYS_OK]";
      }

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    animateCursor();

    return () => {
      window.removeEventListener("mousemove", updateMousePos);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="
        pointer-events-none
        fixed
        top-0
        left-0
        z-[99999]
        border
        hidden
        md:flex
        items-center
        justify-center
        transition-[border-color,background-color,border-radius]
        duration-150
        ease-out
      "
      style={{
        width: "12px",
        height: "12px",
      }}
    >
      {/* HUD System Overlay */}
      <div
        ref={hudRef}
        className="
          absolute
          left-full
          top-full
          ml-4
          mt-2
          font-mono
          text-[8px]
          leading-none
          text-[#8A8880]
          flex
          flex-col
          gap-0.5
          pointer-events-none
          bg-[#0D0D0D]/80
          backdrop-blur-[2px]
          border
          border-[#222222]/50
          p-1
          select-none
        "
      >
        <span ref={coordsRef}>0, 0</span>
        <span ref={modeRef} className="text-[#E8FF00] font-bold">[SYS_OK]</span>
      </div>
    </div>
  );
}
