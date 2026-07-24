"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Terminal, CheckCircle2 } from "lucide-react";

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6] pt-28 pb-20 px-6 md:px-12 lg:px-24 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4BE2C4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-[#E8FF00]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#8A8880] hover:text-[#4BE2C4] transition-colors uppercase tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            [ Return to System ]
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-[#222222] pb-10 mb-12"
        >
          <div className="flex items-center gap-3 font-mono text-xs text-[#4BE2C4] uppercase tracking-widest mb-3">
            <Terminal size={14} />
            <span>[ SYSTEM GOVERNANCE // PROTOCOL 2026 ]</span>
          </div>
          <h1 className="font-mono text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#F0EDE6] mb-4">
            CODE OF CONDUCT
          </h1>
          <p className="font-mono text-sm text-[#8A8880] leading-relaxed max-w-2xl">
            The Weekly Challenges Organizing Committee is committed to providing a fair, respectful, and competitive learning environment for all participants. By registering for the event, every participant agrees to abide by the following Code of Conduct.
          </p>
        </motion.div>

        {/* Content Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-12 text-sm leading-relaxed text-[#C0BEB8]"
        >
          {/* Section 1 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">1.</span> Respect and Professionalism
            </h2>
            <ul className="space-y-3 list-none font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Treat fellow participants, organizers, mentors, judges, volunteers, and college staff with respect at all times.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Maintain professionalism in all communications, both online and offline.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Any form of harassment, discrimination, bullying, intimidation, abusive language, or inappropriate behavior based on gender, race, religion, nationality, disability, or any protected characteristic will not be tolerated.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Participants must follow all instructions issued by the organizing committee throughout the competition.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">2.</span> Fair Play and Academic Integrity
            </h2>
            <p className="mb-4 text-[#8A8880] font-mono text-xs">
              Weekly Challenges is built on the principle that every participant's rank should reflect their own skill, consistency, and effort.
            </p>
            <p className="mb-3 font-semibold text-[#F0EDE6]">Participants must:</p>
            <ul className="space-y-3 list-none font-sans mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Solve every weekly challenge independently.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Submit only original work.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Avoid copying code or solutions from any participant or online source.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Refrain from sharing complete solutions during an active submission window.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Discuss approaches only after the official submission window has closed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Provide proper attribution whenever third-party code or libraries are used where permitted.</span>
              </li>
            </ul>
            <p className="text-[#8A8880] italic">
              Every submission may undergo plagiarism detection and manual review before qualification for Round 2.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">3.</span> Weekly Challenge Rules
            </h2>
            <ul className="space-y-3 list-none font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>One coding challenge will be released every <strong className="text-[#F0EDE6]">Sunday at 4:00 PM</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Participants have until <strong className="text-[#F0EDE6]">Monday 11:59 PM</strong> to submit their solutions for scoring.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Editorials and official solutions will be released after the submission window closes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Submissions made after the deadline may be accepted for learning purposes but will <strong className="text-[#F0EDE6]">not</strong> contribute towards XP or leaderboard rankings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Every weekly challenge contributes to the participant's overall standing; consistency across all six weeks is essential.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">4.</span> Submission Guidelines
            </h2>
            <p className="mb-3 font-semibold text-[#F0EDE6]">Participants are responsible for ensuring that:</p>
            <ul className="space-y-3 list-none font-sans mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Solutions are submitted before the deadline.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Submitted code compiles and executes correctly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>The correct files are uploaded.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Internet or technical issues do not delay submissions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Multiple submissions are allowed unless otherwise specified; only the latest valid submission before the deadline will be considered.</span>
              </li>
            </ul>
            <p className="text-[#8A8880]">
              Late submissions due to personal technical issues will generally not be accommodated.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">5.</span> AI and External Tools
            </h2>
            <p className="mb-4 text-[#C0BEB8]">
              To ensure a fair and skill-based competition, the use of Artificial Intelligence (AI) tools is strictly prohibited during the active submission window of every weekly challenge.
            </p>
            <p className="mb-4 text-[#C0BEB8]">
              Participants must solve all problems independently using their own knowledge and programming skills.
            </p>
            <p className="mb-3 font-semibold text-[#F0EDE6]">The following actions are strictly prohibited:</p>
            <ul className="space-y-3 list-none font-sans mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Using AI to generate complete or partial solutions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Using AI to explain problem statements or suggest algorithms during the contest.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Using AI-generated code with or without modification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Using browser extensions or IDE plugins that provide AI-assisted coding.</span>
              </li>
            </ul>
            <p className="font-mono text-xs font-bold text-[#E8FF00] uppercase tracking-wider">
              All decisions made by the us regarding AI usage and rule violations shall be final and binding.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">6.</span> Collaboration Policy
            </h2>
            <div className="space-y-4 font-sans">
              <div>
                <p className="font-semibold text-[#F0EDE6] mb-2">Participants may:</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4BE2C4] mt-1">•</span>
                    <span>Discuss programming concepts after the submission window closes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4BE2C4] mt-1">•</span>
                    <span>Learn from editorials and official solutions.</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[#F0EDE6] mb-2">Participants may <strong className="text-[#FF4D4D]">not</strong>:</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4D4D] mt-1">•</span>
                    <span>Exchange working code during an active challenge.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4D4D] mt-1">•</span>
                    <span>Submit another participant's work.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4D4D] mt-1">•</span>
                    <span>Solve challenges together if the competition is designated as individual.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4D4D] mt-1">•</span>
                    <span>Share private test cases or hidden evaluation details.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">7.</span> Leaderboard and XP
            </h2>
            <p className="mb-3 font-semibold text-[#F0EDE6]">XP is awarded based on:</p>
            <ul className="space-y-3 list-none font-sans mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Correctness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Relative ranking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Consistency across all six weekly challenges</span>
              </li>
            </ul>
            <p className="text-[#8A8880] mb-2">
              Leaderboard positions are updated periodically and remain subject to verification.
            </p>
            <p className="text-[#8A8880]">
              The organizing committee reserves the right to recalculate scores if irregularities are detected.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">8.</span> Round 2 Eligibility
            </h2>
            <p className="mb-3 text-[#8A8880]">Only verified participants are eligible for the Offline Finale.</p>
            <p className="mb-3 font-semibold text-[#F0EDE6]">Qualification is based on:</p>
            <ul className="space-y-3 list-none font-sans mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Final Round 1 leaderboard ranking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Successful plagiarism verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Compliance with all event rules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Completion of any verification process requested by the organizers</span>
              </li>
            </ul>
            <div className="p-4 bg-[#4BE2C4]/10 border border-[#4BE2C4]/30 rounded font-mono text-xs text-[#4BE2C4]">
              The Top 20 verified participants will advance to the Offline Finale at TSEC.
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">9.</span> Internship Opportunities
            </h2>
            <p className="mb-3 text-[#C0BEB8]">
              Round 2 qualifiers become eligible for internship opportunities offered by the event's hiring partners.
            </p>
            <p className="text-[#8A8880]">
              Eligibility for internship opportunities may be revoked if any participant is later found violating the Code of Conduct or Fair Play Policy.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">10.</span> Online Conduct
            </h2>
            <p className="mb-3 font-semibold text-[#F0EDE6]">Participants must not:</p>
            <ul className="space-y-3 list-none font-sans mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Create multiple accounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Attempt to manipulate rankings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Exploit bugs or vulnerabilities in the platform.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Interfere with another participant's submission.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Share login credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4D4D] mt-1">•</span>
                <span>Misrepresent their identity.</span>
              </li>
            </ul>
            <p className="text-[#8A8880]">
              Any attempt to gain an unfair competitive advantage will be treated as misconduct.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">11.</span> Communication
            </h2>
            <ul className="space-y-3 list-none font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Official announcements regarding schedules, deadlines, editorial releases, leaderboard updates, and event changes will be communicated through the designated event channels.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Participants are responsible for staying updated with official announcements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Failure to read official communications will not be accepted as grounds for exceptions.</span>
              </li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="bg-[#121212] border border-[#FF4D4D]/30 p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#FF4D4D] uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert size={20} className="text-[#FF4D4D]" />
              <span>12. Violations and Penalties</span>
            </h2>
            <p className="mb-6 text-[#C0BEB8]">
              Depending on the severity of the violation, the organizing committee may impose one or more of the following actions:
            </p>

            <div className="space-y-6 font-sans">
              <div className="border-l-2 border-[#E8FF00] pl-4">
                <h3 className="font-mono text-sm font-bold text-[#E8FF00] uppercase mb-2">Minor Violation</h3>
                <ul className="space-y-1 list-disc list-inside text-[#8A8880]">
                  <li>Formal warning</li>
                  <li>Submission marked invalid</li>
                </ul>
              </div>

              <div className="border-l-2 border-orange-500 pl-4">
                <h3 className="font-mono text-sm font-bold text-orange-400 uppercase mb-2">Repeated Violation</h3>
                <ul className="space-y-1 list-disc list-inside text-[#8A8880]">
                  <li>Disqualification from one or more weekly challenges</li>
                  <li>Removal from the leaderboard</li>
                  <li>Ineligibility for Round 2</li>
                </ul>
              </div>

              <div className="border-l-2 border-[#FF4D4D] pl-4">
                <h3 className="font-mono text-sm font-bold text-[#FF4D4D] uppercase mb-2">Severe Violation</h3>
                <p className="text-xs text-[#8A8880] mb-2 italic">
                  Including but not limited to: Plagiarism, Code sharing during an active contest, Multiple accounts, Identity impersonation, Platform manipulation, Harassment or abusive conduct.
                </p>
                <p className="font-semibold text-[#F0EDE6] mb-1">May result in:</p>
                <ul className="space-y-1 list-disc list-inside text-[#8A8880]">
                  <li>Immediate disqualification</li>
                  <li>Permanent removal from Weekly Challenges</li>
                  <li>Cancellation of certificates</li>
                  <li>Removal from internship eligibility</li>
                </ul>
              </div>
            </div>

            <p className="mt-6 text-xs font-mono text-[#8A8880] italic">
              These consequences align with the event's Fair Play Policy.
            </p>
          </section>

          {/* Section 13 */}
          <section className="bg-[#121212] border border-[#222222] p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#4BE2C4]">13.</span> Organizer Rights
            </h2>
            <p className="mb-3 text-[#8A8880]">The Weekly Challenges Organizing Committee reserves the right to:</p>
            <ul className="space-y-3 list-none font-sans mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Modify schedules, challenge formats, scoring methods, or rules whenever necessary.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Verify participant identity and submissions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Investigate suspected violations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Request additional information or repository access.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BE2C4] mt-1">•</span>
                <span>Make final decisions regarding disputes, penalties, rankings, and eligibility.</span>
              </li>
            </ul>
            <p className="font-mono text-xs font-bold text-[#E8FF00] uppercase tracking-wider">
              All decisions made by the organizing committee shall be final and binding.
            </p>
          </section>

          {/* Section 14 */}
          <section className="bg-[#121212] border border-[#4BE2C4]/40 p-6 md:p-8 rounded-lg">
            <h2 className="font-mono text-lg font-bold text-[#F0EDE6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#4BE2C4]" />
              <span>14. Acceptance of the Code of Conduct</span>
            </h2>
            <p className="text-[#C0BEB8] leading-relaxed mb-4">
              By registering for Weekly Challenges 2026, participants acknowledge that they have read, understood, and agreed to abide by this Code of Conduct, the Fair Play Policy, and all event rules.
            </p>
            <p className="text-[#8A8880] text-xs font-mono">
              Failure to comply with these guidelines may result in warnings, score deductions, disqualification, removal from the competition, or forfeiture of Round 2 and internship eligibility without prior notice.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
