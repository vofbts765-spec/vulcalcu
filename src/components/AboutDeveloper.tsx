import React from 'react';
import { Terminal, Shield, Award, UserCheck, BookOpen, ExternalLink } from 'lucide-react';

export const AboutDeveloper: React.FC = () => {
  return (
    <section
      id="about-developer-section"
      className="bg-[#090e18] border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden"
      aria-label="About Developer and Tool"
    >
      {/* Ambient background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left / Main Info Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Section Number & Monospace Tag */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>// ABOUT DEVELOPER</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
              RESEARCH // PROJECT ORIGIN
            </span>
          </div>

          {/* Prominent Headline */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-mono font-extrabold text-white tracking-tight">
            Built for Security Research.
          </h2>

          {/* Detailed Paragraph */}
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            BUG//CALC is an educational vulnerability assessment interface created by{' '}
            <strong className="text-white font-bold font-mono tracking-wide underline decoration-emerald-500/50 decoration-2 underline-offset-4">
              Abdurrahman
            </strong>
            , a web security researcher. The tool demonstrates how different vulnerability characteristics can influence a simplified severity assessment and illustrative bounty estimate.
          </p>

          {/* Research & Educational Pillars */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#060910] border border-slate-800/90 text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Offensive Web Security Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#060910] border border-slate-800/90 text-slate-300">
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Educational Bounty Modeling</span>
            </div>
          </div>
        </div>

        {/* Right / Developer Profile Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-[#050810] border border-emerald-500/25 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-4">
            {/* Top Card Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Lead Researcher
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                SECURITY RESEARCH
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-400 text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
                AR
              </div>
              <div>
                <h3 className="font-mono font-bold text-base sm:text-lg text-white flex items-center gap-1.5">
                  Abdurrahman
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Web Security Researcher
                </p>
                <p className="text-[11px] font-mono text-emerald-400/90 mt-0.5">
                  Creator of BUG//CALC
                </p>
              </div>
            </div>

            {/* Footer Badge within Card */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Author
              </span>
              <span className="text-slate-500">v1.0.0 Open Sec</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
