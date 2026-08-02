"use client";

import React, { useState } from 'react';
import {
  Monitor,
  Apple,
  Terminal,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Cpu,
  RefreshCw,
  ShieldAlert,
  Info
} from 'lucide-react';

const SETUP_DOWNLOAD_URL = "https://github.com/codexllamma/runtime-frontend/releases/download/v1.0.0/CodeCellSetup-v1.0.0.exe";

export default function SetupGuide() {
  const [activeTab, setActiveTab] = useState('windows');
  const [copiedKey, setCopiedKey] = useState<any>(null);

  const handleCopy = (text: any, key: any) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // macOS Commands
  const macInstallCmds = `brew tap codexllamma/codecell\nbrew trust codexllamma/codecell\nbrew install codecell-runtime`;
  const macServiceCmds = `brew services start codecell-runtime\nbrew services list`;
  const macCurlPythonCmd = `curl -X POST http://localhost:4321/install -H "Content-Type: application/json" -d '{"language": "python"}'`;
  const macCurlJavaCmd = `curl -X POST http://localhost:4321/install -H "Content-Type: application/json" -d '{"language": "java"}'`;
  const macResetCmd = `brew services stop codecell-runtime\nbrew uninstall codecell-runtime\nrm -rf $(brew --cache)/downloads/*codecell*\nrm -rf ~/.config/CodeCell`;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-hi)] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">

      {/* Background King watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-10 -top-10 text-[26rem] leading-none text-[var(--color-gold)]/[0.03] font-serif"
      >
        ♚
      </div>

      <div className="max-w-4xl w-full space-y-8 relative">

        {/* ======================================================================== */}
        {/* SECTION: PAGE HEADER                                                     */}
        {/* ======================================================================== */}
        <div className="text-center space-y-3">
          <span className="inline-block font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-gold)]/80 border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 px-3 py-1 rounded-full">
            TSCE CodeCell / Contest Arena 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-wide text-[var(--color-text-hi)]">
            CodeCell <span className="text-[var(--color-gold)]">Runtime Setup</span>
          </h1>
          <p className="text-[var(--color-text-mid)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Configure your local background runtime engine to execute Python, Java, and C++ code directly during contests.
          </p>
        </div>

        {/* ======================================================================== */}
        {/* SECTION: PLATFORM TABS                                                   */}
        {/* ======================================================================== */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
          <button
            onClick={() => setActiveTab('windows')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-mono tracking-wide transition-all ${
              activeTab === 'windows'
                ? 'bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-glow)] text-[var(--color-bg)] font-semibold shadow-[0_0_18px_rgba(212,175,55,0.28)]'
                : 'text-[var(--color-text-mid)] hover:text-[var(--color-text-hi)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Windows
          </button>

          <button
            onClick={() => setActiveTab('macos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-mono tracking-wide transition-all ${
              activeTab === 'macos'
                ? 'bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-glow)] text-[var(--color-bg)] font-semibold shadow-[0_0_18px_rgba(212,175,55,0.28)]'
                : 'text-[var(--color-text-mid)] hover:text-[var(--color-text-hi)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            <Apple className="w-4 h-4" />
            macOS/Linux
          </button>

          <button
            onClick={() => setActiveTab('testing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-mono tracking-wide transition-all ${
              activeTab === 'testing'
                ? 'bg-[var(--color-cyan)] text-[var(--color-bg)] font-semibold shadow-[0_0_18px_rgba(75,226,196,0.25)]'
                : 'text-[var(--color-text-mid)] hover:text-[var(--color-text-hi)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--color-cyan)]" />
            Testing &amp; Verification
          </button>
        </div>

        {/* ======================================================================== */}
        {/* SECTION: TAB CONTENT AREA                                                */}
        {/* ======================================================================== */}
        <div className="bg-[var(--color-surface)]/90 border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">

          {/* ---------------------------------------------------------------------- */}
          {/* TAB 1: WINDOWS INSTALLATION GUIDE                                      */}
          {/* ---------------------------------------------------------------------- */}
          {activeTab === 'windows' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-serif font-semibold text-[var(--color-text-hi)] flex items-center gap-2 tracking-wide">
                  <Monitor className="text-[var(--color-gold)]" /> Windows Complete Setup Guide
                </h2>
                <p className="text-[var(--color-text-mid)] text-sm mt-1">
                  Follow these step-by-step instructions to download, bypass browser prompts, and install the CodeCell Runtime.
                </p>
              </div>

              {/* STEP 1: DOWNLOAD & UNTRUSTED BYPASS */}
              <div className="space-y-4 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Download &amp; Bypass Security Warnings</h3>
                </div>

                <p className="text-sm text-[var(--color-text-mid)] leading-relaxed">
                  Start by downloading <code className="text-[var(--color-gold)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded border border-[var(--color-border)] font-mono">CodeCellSetup-v1.0.0.exe</code> below:
                </p>

                <div>
                  <a
                    href={SETUP_DOWNLOAD_URL}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-glow)] hover:brightness-110 text-[var(--color-bg)] rounded-lg text-xs font-mono font-semibold tracking-wide transition-all shadow-[0_0_18px_rgba(212,175,55,0.28)]"
                  >
                    <Download className="w-4 h-4" /> Download CodeCellSetup-v1.0.0.exe
                  </a>
                </div>

                {/* WHY IS THIS HAPPENING DISCLAIMER */}
                <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono font-bold text-xs tracking-wide uppercase">
                    <ShieldAlert className="w-4 h-4" /> Why does Chrome or Windows flag this executable?
                  </div>
                  <p className="text-xs text-[var(--color-text-mid)] leading-relaxed">
                    Because this is a freshly compiled open-source executable created by a student developer committee (without paying $500+/yr for EV enterprise signing certificates), modern browsers (Chrome, Edge) and Windows SmartScreen automatically flag new <code className="text-[var(--color-text-hi)] font-mono">.exe</code> files as <em>"untrusted downloads"</em> until thousands of users download them. This is completely normal for new developer tooling.
                  </p>
                </div>

                {/* HOW TO BYPASS BROWSER INSTRUCTIONS */}
                <div className="p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono font-bold text-xs tracking-wide uppercase">
                    <Info className="w-4 h-4" /> How to Keep the File in Chrome / Edge:
                  </div>
                  <ol className="list-decimal list-inside text-xs text-[var(--color-text-hi)]/90 space-y-1.5 leading-relaxed">
                    <li>Do not just click the small popup box in the top right, as browser defaults try to block it there.</li>
                    <li>Open your browser's Downloads page by pressing <kbd className="bg-[var(--color-bg)] border border-[var(--color-border)] px-1.5 py-0.5 rounded font-mono text-[10px]">Ctrl + J</kbd> (or go to <code className="text-[var(--color-gold)]">chrome://downloads</code>).</li>
                    <li>Locate <code className="text-[var(--color-text-hi)]">CodeCellSetup-v1.0.0.exe</code> and click <strong>"Download unverified file"</strong> / <strong>"Keep anyways"</strong>.</li>
                  </ol>
                </div>

                {/* SCREENSHOT 1: BROWSER DOWNLOAD BLOCKED POPUP */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-1-download-blocked.png"
                      alt="Chrome Unverified Download Blocked"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>

                {/* SCREENSHOT 2: DOWNLOAD UNVERIFIED FILE BUTTON */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-2-download-unverified.png"
                      alt="Download Unverified File Option"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>

                {/* WINDOWS DEFENDER / SMARTSCREEN WARNING */}
                <div className="p-4 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-xl space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono font-bold text-xs tracking-wide uppercase">
                    <AlertTriangle className="w-4 h-4" /> Windows Protected Your PC / SmartScreen Warning
                  </div>
                  <p className="text-xs text-[var(--color-text-mid)] leading-relaxed">
                    When opening the installer, Windows SmartScreen may show a purple prompt stating <em>"Windows protected your PC"</em>:
                  </p>
                  <ol className="list-decimal list-inside text-xs text-[var(--color-text-hi)]/90 space-y-1.5 leading-relaxed">
                    <li>Click the underlined <strong>"More info"</strong> link on the prompt.</li>
                    <li>A button labeled <strong>"Run anyway"</strong> will appear at the bottom—click it to launch the setup wizard.</li>
                  </ol>
                </div>

                {/* SCREENSHOT 3: WINDOWS SMARTSCREEN MORE INFO */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-3-smartscreen-more-info.png"
                      alt="Windows Defender SmartScreen More Info"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>

                {/* SCREENSHOT 4: WINDOWS SMARTSCREEN RUN ANYWAY */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-4-smartscreen-run-anyway.png"
                      alt="Windows Defender SmartScreen Run Anyway Button"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: TOOLCHAIN COMPONENT SELECTION */}
              <div className="space-y-3 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Automatic Toolchain Detection &amp; Selection</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)] leading-relaxed">
                  On the components page, the installer automatically scans your system environment:
                </p>

                {/* 3 CASES CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                  <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg space-y-1">
                    <span className="text-xs font-mono font-bold text-[var(--color-gold)] flex items-center gap-1 uppercase tracking-wide">
                      <Cpu className="w-3.5 h-3.5" /> Case 1: System App
                    </span>
                    <p className="text-xs text-[var(--color-text-mid)]">
                      If Python, Java, or GCC exists on your system PATH, it marks it as <em>System App Detected</em> and unchecks it.
                    </p>
                  </div>

                  <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg space-y-1">
                    <span className="text-xs font-mono font-bold text-[var(--color-text-hi)] flex items-center gap-1 uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-cyan)]" /> Case 2: Already Installed
                    </span>
                    <p className="text-xs text-[var(--color-text-mid)]">
                      If you previously fetched toolchains via CodeCell Runtime, it marks them as <em>Already Installed</em> to prevent duplicate downloads.
                    </p>
                  </div>

                  <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg space-y-1">
                    <span className="text-xs font-mono font-bold text-[var(--color-cyan)] flex items-center gap-1 uppercase tracking-wide">
                      <Download className="w-3.5 h-3.5" /> Case 3: Missing Toolchain
                    </span>
                    <p className="text-xs text-[var(--color-text-mid)]">
                      If a runtime is missing on your PC, it automatically queues it for download and extraction into your local CodeCell folder.
                    </p>
                  </div>
                </div>

                {/* DISCLAIMER BOX */}
                <div className="p-3.5 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--color-text-hi)]/80 leading-relaxed">
                    <strong>Compiler Version Advice:</strong> If you prefer our tested, exact binary versions, explicitly check the language boxes to let the wizard fetch them. Using system compilers is fine as long as you are confident in your environment.
                  </p>
                </div>

                {/* SCREENSHOT 5: COMPONENT DETECTION (DEFAULT) */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-5-components-detected.png"
                      alt="Components Automatically Detected"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>

                {/* SCREENSHOT 6: COMPONENT SELECTION (CHECKED) */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-6-components-selected.png"
                      alt="Explicitly Selecting Toolchain to Install"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: CONFIRMATION PAGE */}
              <div className="space-y-3 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Confirm Installation Settings</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)] leading-relaxed">
                  Review the target directory and selected runtimes on the ready-to-install confirmation screen, then click <strong className="text-[var(--color-text-hi)]">Install</strong>.
                </p>

                {/* SCREENSHOT 7: CONFIRMATION / READY TO INSTALL */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-7-ready-to-install.png"
                      alt="Ready to Install Confirmation Screen"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 4: DOWNLOADING & EXTRACTING */}
              <div className="space-y-3 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">4</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Downloading &amp; Extracting Toolchains</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)] leading-relaxed">
                  The setup wizard will first fetch selected toolchain zip files from GitHub Releases, then automatically uncompress them into your local runtime folder.
                </p>

                {/* SCREENSHOT 8: DOWNLOADING TOOLCHAINS */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-8-downloading-toolchains.png"
                      alt="Downloading Toolchain Progress Bar"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>

                {/* SCREENSHOT 9: FINISHING INSTALLATION */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-9-finishing-install.png"
                      alt="Finishing Installation Progress Screen"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 5: FINISH & LAUNCH */}
              <div className="space-y-3 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">5</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Complete Setup &amp; Launch Daemon</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)] leading-relaxed">
                  Once finished, leave <strong className="text-[var(--color-text-hi)]">Open CodeCell Dashboard</strong> checked and click <strong className="text-[var(--color-text-hi)]">Finish</strong>. The setup daemon starts silently in the background.
                </p>

                {/* SCREENSHOT 10: FINISH SUCCESS SCREEN */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-10-finish-success.png"
                      alt="Completing Setup Wizard Screen"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 6: SYSTEM TRAY & STATUS VERIFICATION */}
              <div className="space-y-3 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">6</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Verify System Tray &amp; Dashboard Active Status</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)] leading-relaxed">
                  Your browser will launch to <code className="text-[var(--color-cyan)] font-mono">http://localhost:4321</code> showing registered language toolchains, and the CodeCell icon will sit active in your Windows System Tray.
                </p>

                {/* SCREENSHOT 11: ACTIVE DASHBOARD RUNNING */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/win-11-dashboard-running.png"
                      alt="CodeCell Runtime Active Dashboard"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------- */}
          {/* TAB 2: MACOS INSTALLATION GUIDE                                        */}
          {/* ---------------------------------------------------------------------- */}
          {activeTab === 'macos' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-serif font-semibold text-[var(--color-text-hi)] flex items-center gap-2 tracking-wide">
                  <Apple className="text-[var(--color-gold)]" /> macOS/Linux Homebrew &amp; Terminal Setup
                </h2>
                <p className="text-[var(--color-text-mid)] text-sm mt-1">
                  Follow these terminal steps to tap the repository, start the daemon service, and trigger toolchain installs.
                </p>
              </div>

              {/* PART 1 */}
              <div className="space-y-3 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Tap Repository &amp; Install Runtime Package</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)]">Open Terminal and run the Homebrew setup commands:</p>

                <div className="relative bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 font-mono text-xs sm:text-sm text-[var(--color-gold)]">
                  <button
                    onClick={() => handleCopy(macInstallCmds, 'mac-install')}
                    className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-border)] hover:bg-[var(--color-border-hi)] text-[var(--color-text-hi)] rounded text-xs font-mono transition-all"
                  >
                    {copiedKey === 'mac-install' ? <Check className="w-3.5 h-3.5 text-[var(--color-cyan)]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'mac-install' ? 'Copied' : 'Copy'}
                  </button>
                  <pre className="pr-16 leading-relaxed">
{`brew tap codexllamma/codecell
brew trust codexllamma/codecell
brew install codecell-runtime`}
                  </pre>
                </div>

                {/* MACOS SCREENSHOT 1: BREW INSTALL */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/mac-1-brew-install.png"
                      alt="macOS Brew Installation Terminal"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* PART 2 */}
              <div className="space-y-3 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Start &amp; Verify Background Service</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)]">Start the CodeCell daemon and confirm it is highlighted as active in your services list:</p>

                <div className="relative bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 font-mono text-xs sm:text-sm text-[var(--color-gold)]">
                  <button
                    onClick={() => handleCopy(macServiceCmds, 'mac-service')}
                    className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-border)] hover:bg-[var(--color-border-hi)] text-[var(--color-text-hi)] rounded text-xs font-mono transition-all"
                  >
                    {copiedKey === 'mac-service' ? <Check className="w-3.5 h-3.5 text-[var(--color-cyan)]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'mac-service' ? 'Copied' : 'Copy'}
                  </button>
                  <pre className="pr-16 leading-relaxed">
{`brew services start codecell-runtime
brew services list`}
                  </pre>
                </div>

                {/* MACOS SCREENSHOT 2: BREW SERVICES */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/mac-2-brew-services.png"
                      alt="macOS Brew Services Active List"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* PART 3 */}
              <div className="space-y-4 border-l-2 border-[var(--color-gold)]/30 pl-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <h3 className="font-serif font-semibold text-[var(--color-text-hi)] text-base">Trigger Toolchain Downloads (via API)</h3>
                </div>
                <p className="text-sm text-[var(--color-text-mid)]">Trigger on-demand toolchain downloading directly using <code className="text-[var(--color-gold)] font-mono">curl</code>:</p>

                {/* Python Trigger */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold text-[var(--color-text-hi)] uppercase tracking-wide flex items-center gap-1.5">
                    Python 3 Toolchain:
                  </span>
                  <div className="relative bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 font-mono text-xs text-[var(--color-gold)] overflow-x-auto">
                    <button
                      onClick={() => handleCopy(macCurlPythonCmd, 'mac-curl-python')}
                      className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-border)] hover:bg-[var(--color-border-hi)] text-[var(--color-text-hi)] rounded text-xs font-mono transition-all"
                    >
                      {copiedKey === 'mac-curl-python' ? <Check className="w-3.5 h-3.5 text-[var(--color-cyan)]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'mac-curl-python' ? 'Copied' : 'Copy'}
                    </button>
                    <pre className="pr-16 whitespace-pre-wrap leading-relaxed">{macCurlPythonCmd}</pre>
                  </div>

                  <div className="p-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs space-y-1">
                    <span className="text-[var(--color-text-mid)] font-mono uppercase tracking-wide">Expected Response:</span>
                    <code className="block text-[var(--color-cyan)] font-mono">
                      {`{"success": true, "message": "Toolchain 'python' installed successfully"}`}
                    </code>
                  </div>
                </div>

                {/* Java Trigger */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-semibold text-[var(--color-text-hi)] uppercase tracking-wide flex items-center gap-1.5">
                    Java OpenJDK 21 Toolchain:
                  </span>
                  <div className="relative bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 font-mono text-xs text-[var(--color-gold)] overflow-x-auto">
                    <button
                      onClick={() => handleCopy(macCurlJavaCmd, 'mac-curl-java')}
                      className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-border)] hover:bg-[var(--color-border-hi)] text-[var(--color-text-hi)] rounded text-xs font-mono transition-all"
                    >
                      {copiedKey === 'mac-curl-java' ? <Check className="w-3.5 h-3.5 text-[var(--color-cyan)]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'mac-curl-java' ? 'Copied' : 'Copy'}
                    </button>
                    <pre className="pr-16 whitespace-pre-wrap leading-relaxed">{macCurlJavaCmd}</pre>
                  </div>

                  <div className="p-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs space-y-1">
                    <span className="text-[var(--color-text-mid)] font-mono uppercase tracking-wide">Expected Response:</span>
                    <code className="block text-[var(--color-cyan)] font-mono">
                      {`{"success": true, "message": "Toolchain 'java' installed successfully"}`}
                    </code>
                  </div>
                </div>

                {/* MACOS SCREENSHOT 3: API CURL RESPONSE */}
                <div className="mt-3">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                    <img
                      src="/screenshots/mac-3-curl-response.png"
                      alt="macOS Curl Install Response"
                      className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* CLEAN RESET SCRIPT */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
                <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono font-semibold text-sm uppercase tracking-wide">
                  <RefreshCw className="w-4 h-4" /> Need a Clean Re-Take?
                </div>
                <p className="text-xs text-[var(--color-text-mid)]">
                  If you need to completely wipe the installation and cache to perform a fresh install, run this reset snippet:
                </p>

                <div className="relative bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 font-mono text-xs text-[var(--color-gold)]/90 overflow-x-auto">
                  <button
                    onClick={() => handleCopy(macResetCmd, 'mac-reset')}
                    className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-border)] hover:bg-[var(--color-border-hi)] text-[var(--color-text-hi)] rounded text-xs font-mono transition-all"
                  >
                    {copiedKey === 'mac-reset' ? <Check className="w-3.5 h-3.5 text-[var(--color-cyan)]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'mac-reset' ? 'Copied' : 'Copy'}
                  </button>
                  <pre className="pr-16 leading-relaxed">{macResetCmd}</pre>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------- */}
          {/* TAB 4: TESTING & VERIFICATION                                          */}
          {/* ---------------------------------------------------------------------- */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif font-semibold text-[var(--color-text-hi)] flex items-center gap-2 tracking-wide">
                  <CheckCircle2 className="text-[var(--color-cyan)]" /> Verification &amp; Testing
                </h2>
                <p className="text-[var(--color-text-mid)] text-sm mt-1">
                  Ensure your local runtime daemon is listening before entering the test week contest environment.
                </p>
              </div>

              {/* RECOMMENDED BROWSER NOTICE FOR MACOS / SAFARI */}
              <div className="p-4 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[var(--color-gold)] font-mono font-bold text-xs tracking-wide uppercase">
                  <ShieldAlert className="w-4 h-4" /> Recommended Browser: Google Chrome or Brave
                </div>
                <p className="text-xs text-[var(--color-text-hi)]/90 leading-relaxed">
                  For the best experience, open the CodeCell Contest Arena using <strong>Google Chrome</strong> or <strong>Brave Browser</strong>.
                </p>
                <p className="text-xs text-[var(--color-text-mid)] leading-relaxed">
                  <strong>macOS / Safari Warning:</strong> Safari and strict private-network security policies aggressively block HTTPS web applications from sending requests to local background endpoints (<code className="text-[var(--color-gold)] font-mono">http://localhost:4321</code>). If you are on macOS, please use Google Chrome to ensure your browser can communicate with your local CodeCell Runtime daemon without interference.
                </p>
              </div>

              {/* LOCALHOST HEALTHCARD */}
              <div className="bg-[var(--color-bg)] border border-[var(--color-border)] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-mid)] font-mono uppercase tracking-wide">Local Daemon Status Endpoint:</span>
                  <span className="text-[var(--color-cyan)] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-ping"></span>
                    http://localhost:4321
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-mid)] leading-relaxed">
                  When you open the TSCE CodeCell official app, it will perform a background handshake with this endpoint. If active, code executions will be routed to your local machine for rapid feedback.
                </p>
              </div>

              {/* SCREENSHOT: VERIFICATION PASS */}
              <div className="mt-3">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 flex items-center justify-center overflow-hidden shadow-lg transition-colors hover:border-[var(--color-gold)]/30">
                  <img
                    src="/screenshots/verification-pass.png"
                    alt="Code Execution Verification Pass"
                    className="max-h-[420px] max-w-full w-auto h-auto rounded-lg object-contain"
                    onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </div>

              {/* FINAL CTA BUTTON */}
              <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
                <a
                  href="/events/weekly-challenges/timeline"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-cyan)] hover:brightness-110 text-[var(--color-bg)] font-mono font-semibold tracking-wide rounded-xl shadow-[0_0_18px_rgba(75,226,196,0.25)] transition-all text-sm group"
                >
                  Proceed to Test Week Platform
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}