"use client";

import React from "react";

export function CyberGrid() {
    return (
        <div className="absolute inset-0 -z-50 overflow-hidden bg-[#0a0a0a] select-none pointer-events-none">
            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #4BE2C4 1px, transparent 1px),
            linear-gradient(to bottom, #4BE2C4 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Faint, premium ambient cyan blur at the top center */}
            <div
                className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[80vw] h-[50vw] max-w-[1000px] rounded-full opacity-30 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at center, rgba(75, 226, 196, 0.18) 0%, transparent 70%)",
                    filter: "blur(130px)"
                }}
            />

            {/* Subtle bottom-right lighting for depth using theme lime */}
            <div
                className="absolute bottom-[-20%] right-[10%] w-[50vw] h-[50vw] rounded-full opacity-20 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at center, rgba(232, 255, 0, 0.12) 0%, transparent 80%)",
                    filter: "blur(150px)"
                }}
            />
        </div>
    );
}
