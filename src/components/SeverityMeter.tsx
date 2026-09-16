import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { AlertTriangle, Copy, Check, Info, ShieldCheck, Zap } from 'lucide-react';
import { playSelectSound } from '../utils/audio';

interface SeverityMeterProps {
  result: CalculationResult;
  vulnName: string;
}

export const SeverityMeter: React.FC<SeverityMeterProps> = ({ result, vulnName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyVector = () => {
    playSelectSound();
    navigator.clipboard.writeText(result.cvssVector);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Severity color styles
  const getSeverityTheme = () => {
    switch (result.severity) {
      case 'Critical':
        return {
          textColor: 'text-red-500',
          borderColor: 'border-red-500/50',
          bgBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
          gradientBar: 'from-orange-600 via-red-600 to-rose-600',
          glowShadow: 'shadow-[0_0_25px_rgba(239,68,68,0.35)]',
          dotColor: 'bg-red-500',
        };
      case 'High':
        return {
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/50',
          bgBadge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          gradientBar: 'from-amber-500 via-orange-500 to-red-500',
          glowShadow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
          dotColor: 'bg-orange-500',
        };
      case 'Medium':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/50',
          bgBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          gradientBar: 'from-yellow-500 via-amber-500 to-orange-500',
          glowShadow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
          dotColor: 'bg-amber-500',
        };
      case 'Low':
        // As user specified: "अगर बिल्कुल low है तो मतलब लाल color होगा उसका"
        return {
          textColor: 'text-red-400',
          borderColor: 'border-red-500/40',
          bgBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
          gradientBar: 'from-rose-500 to-red-600',
          glowShadow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          dotColor: 'bg-red-400',
        };
      default:
        return {
          textColor: 'text-slate-400',
          borderColor: 'border-slate-700',
          bgBadge: 'bg-slate-800 text-slate-400 border-slate-700',
          gradientBar: 'from-slate-600 to-slate-500',
          glowShadow: 'shadow-none',
          dotColor: 'bg-slate-500',
        };
    }
  };

  const theme = getSeverityTheme();
  const clampedPercentage = Math.max(0, Math.min(100, result.percentage));

  return (
    <div
      id="severity-meter-hud"
      className="bg-[#090e18] border border-emerald-950/80 rounded-xl p-3.5 sm:p-6 shadow-xl relative overflow-hidden"
    >
      {/* Background Accent Grid */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Top Header: Severity + Percentage Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4 mb-4 sm:mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] sm:text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              LIVE SEVERITY ANALYSIS
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-mono font-bold text-white tracking-wide break-words">
            {vulnName}
          </h3>
        </div>

        {/* Big Score / Percentage Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/40">
          <div className="text-left sm:text-right">
            <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase">CVSS SCORE</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className={`text-2xl sm:text-4xl font-extrabold ${theme.textColor}`}>
                {result.score.toFixed(1)}
              </span>
              <span className="text-slate-500 text-xs sm:text-sm">/10</span>
            </div>
          </div>

          <div
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border font-mono font-extrabold text-xs sm:text-base flex flex-col items-center justify-center ${theme.bgBadge} ${theme.glowShadow}`}
          >
            <span className="text-[9px] sm:text-xs tracking-wider uppercase opacity-80">SEVERITY</span>
            <span className="whitespace-nowrap">{result.severity}</span>
            <span className="text-[10px] sm:text-xs mt-0.5 font-bold">{clampedPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Unified Severity Line with Continuous Track */}
      <div className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <AlertTriangle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${theme.textColor}`} />
            <span className="truncate">Severity Scale (0% - 100%)</span>
          </span>
          <span className={`font-bold font-mono text-xs sm:text-sm shrink-0 ${theme.textColor}`}>
            {clampedPercentage}% Max
          </span>
        </div>

        {/* Visual Line / Bar Container */}
        <div className="relative pt-6 pb-1 sm:pb-2">
          {/* Animated Glowing Pin Indicator on the line */}
          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-500 ease-out z-20 flex flex-col items-center"
            style={{ left: `${clampedPercentage}%` }}
          >
            <div
              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold whitespace-nowrap shadow-lg border ${theme.bgBadge} ${theme.glowShadow}`}
            >
              {clampedPercentage}%
            </div>
            <div className={`w-1.5 h-2 sm:h-2.5 ${theme.dotColor} rounded-full mt-0.5 animate-pulse`}></div>
          </div>

          {/* The Full Width Line Track */}
          <div className="h-3 sm:h-3.5 w-full bg-[#0d1624] border border-slate-800 rounded-full overflow-hidden p-0.5 relative flex items-center">
            {/* Segment markers in the background */}
            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-20">
              <div className="h-full w-px bg-slate-400"></div>
              <div className="h-full w-px bg-slate-400"></div>
              <div className="h-full w-px bg-slate-400"></div>
              <div className="h-full w-px bg-slate-400"></div>
            </div>

            {/* Filled Progress Portion with Gradient and Glow */}
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${theme.gradientBar} ${theme.glowShadow}`}
              style={{ width: `${clampedPercentage}%` }}
            ></div>
          </div>

          {/* Severity Threshold Segment Labels */}
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1.5 sm:mt-2 px-0.5">
            <span className={result.severity === 'Informational' ? 'text-slate-200 font-bold' : 'text-slate-500'}>
              0%<span className="hidden sm:inline"> Info</span>
            </span>
            <span className={result.severity === 'Low' ? 'text-red-400 font-bold' : 'text-slate-500'}>
              39%<span className="hidden sm:inline"> Low (Red)</span><span className="sm:hidden"> Low</span>
            </span>
            <span className={result.severity === 'Medium' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
              69%<span className="hidden sm:inline"> Medium</span><span className="sm:hidden"> Med</span>
            </span>
            <span className={result.severity === 'High' ? 'text-orange-400 font-bold' : 'text-slate-500'}>
              89%<span className="hidden sm:inline"> High</span>
            </span>
            <span className={result.severity === 'Critical' ? 'text-red-500 font-bold' : 'text-slate-500'}>
              100%<span className="hidden sm:inline"> Critical</span><span className="sm:hidden"> Crit</span>
            </span>
          </div>
        </div>
      </div>

      {/* CVSS Vector String Bar */}
      <div className="bg-[#060a12] border border-slate-800/80 rounded-lg p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
          <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 uppercase shrink-0 font-bold">
            Vector:
          </span>
          <code className="text-[11px] sm:text-xs font-mono text-slate-300 truncate selection:bg-emerald-500/20 block min-w-0">
            {result.cvssVector}
          </code>
        </div>
        <button
          id="copy-cvss-vector-btn"
          onClick={handleCopyVector}
          className="self-end sm:self-center shrink-0 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-[11px] sm:text-xs font-mono text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Vector'}</span>
        </button>
      </div>

      {/* Technical Summary Breakdown */}
      <div className="bg-[#0c1322] border border-slate-800/70 rounded-lg p-3 sm:p-3.5 text-[11px] sm:text-xs font-sans text-slate-300 leading-relaxed flex items-start gap-2 sm:gap-2.5">
        <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white font-mono mr-1">Triage Evaluation:</span>
          {result.summary}
        </div>
      </div>
    </div>
  );
};
