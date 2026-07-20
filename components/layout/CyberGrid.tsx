"use client";

import React from "react";

export function CyberGrid() {
    return (
        <div className="absolute inset-0 -z-50 overflow-hidden bg-black select-none pointer-events-none">
            {/* Very faint, premium ambient gold blur at the top center */}
            <div
                className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[70vw] h-[40vw] max-w-[1000px] rounded-full opacity-20 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.25) 0%, rgba(22, 22, 23, 0.05) 70%, transparent 100%)",
                    filter: "blur(80px)"
                }}
            />

            {/* Subtle bottom-right lighting for depth */}
            <div
                className="absolute bottom-[-15%] right-[10%] w-[35vw] h-[35vw] rounded-full opacity-10 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.12) 0%, transparent 80%)",
                    filter: "blur(120px)"
                }}
            />
        </div>
    );
}
