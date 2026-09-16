import React from 'react';
import { CalculationResult, ExchangeRateInfo } from '../types';
import { formatPkr, formatUsd } from '../utils/exchangeRate';
import { DollarSign, ShieldAlert, Award, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { playSelectSound } from '../utils/audio';

interface BountyEstimatorProps {
  result: CalculationResult;
  exchangeRate: ExchangeRateInfo;
  onRefreshRate: () => void;
}

export const BountyEstimator: React.FC<BountyEstimatorProps> = ({
  result,
  exchangeRate,
  onRefreshRate,
}) => {
  const isInformational = result.severity === 'Informational';

  return (
    <div id="bounty-estimator-container" className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-emerald-950/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-mono font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            BUG BOUNTY PAYOUT ESTIMATES (USD &amp; LIVE PKR)
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time conversion comparing HackerOne vs Bugcrowd typical reward pools at live exchange rates.
          </p>
        </div>

        {/* Live Currency Indicator Badge */}
        <div className="flex items-center gap-2 bg-[#09101d] border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-mono self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">Live Rate:</span>
          <span className="text-emerald-400 font-bold">1 USD = ₨ {exchangeRate.rate.toFixed(2)} PKR</span>
          <button
            onClick={() => {
              playSelectSound();
              onRefreshRate();
            }}
            disabled={exchangeRate.isLoading}
            title="Update live PKR exchange rate"
            className="p-1 hover:bg-emerald-500/10 rounded text-slate-400 hover:text-emerald-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${exchangeRate.isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Informational Warning Box if Informational */}
      {isInformational && (
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 sm:p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-amber-300 text-sm">
              INFORMATIONAL FINDING // NO CASH BOUNTY ($0 / ₨ 0)
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Standard HackerOne and Bugcrowd bug bounty policies explicitly classify purely Informational findings (such as missing SPF/DMARC without relay, software banner disclosure, or theoretical scanner warnings without exploit) as <strong>$0 payout</strong>. These reports are usually closed as &quot;Informative&quot; or &quot;Not Applicable&quot;, offering at most swag or platform reputation points.
            </p>
          </div>
        </div>
      )}

      {/* Two Platform Columns: HackerOne vs Bugcrowd */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. HACKERONE PLATFORM ESTIMATE */}
        <div
          id="hackerone-payout-box"
          className="bg-[#090f1d] border border-emerald-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          {/* Top Logo / Label */}
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black border border-emerald-500/40 flex items-center justify-center font-mono font-black text-emerald-400 text-base">
                  h1
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                    HACKERONE
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-normal">
                      PAYOUT ESTIMATE
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Global Bounty Platform // Public &amp; Private Programs
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-300">
                {result.severity.toUpperCase()}
              </span>
            </div>

            {/* Payout Display in USD and Live PKR */}
            <div className="space-y-4">
              {/* USD Box */}
              <div className="bg-[#050810] border border-slate-800/90 rounded-lg p-3.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  ESTIMATED REWARD RANGE (USD)
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-0.5">
                  {isInformational ? (
                    <span className="text-slate-400 font-medium">$0 (No Bounty)</span>
                  ) : (
                    <>
                      {formatUsd(result.hackerOne.minUsd)}{' '}
                      <span className="text-slate-500 text-lg font-normal">to</span>{' '}
                      {formatUsd(result.hackerOne.maxUsd)}
                    </>
                  )}
                </div>
                {!isInformational && (
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Expected Average Payout: <strong className="text-white">{formatUsd(result.hackerOne.avgUsd)} USD</strong>
                  </div>
                )}
              </div>

              {/* PKR Live Converted Box */}
              <div className="bg-[#050810] border border-emerald-500/20 rounded-lg p-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                  <span>LIVE CONVERTED IN PAKISTANI RUPEES (PKR)</span>
                  <span className="text-emerald-400 font-semibold">₨ Live Sync</span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-0.5">
                  {isInformational ? (
                    <span className="text-slate-400 font-medium">₨ 0 PKR</span>
                  ) : (
                    <>
                      <span className="text-emerald-300">{formatPkr(result.hackerOne.minPkr)}</span>{' '}
                      <span className="text-slate-500 text-base font-normal">to</span>{' '}
                      <span className="text-emerald-300">{formatPkr(result.hackerOne.maxPkr)}</span>
                    </>
                  )}
                </div>
                {!isInformational && (
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Expected Average in PKR: <strong className="text-emerald-400">{formatPkr(result.hackerOne.avgPkr)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HackerOne Platform Advice Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 font-sans leading-relaxed">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{result.hackerOne.tierNote}</span>
            </div>
          </div>
        </div>

        {/* 2. BUGCROWD PLATFORM ESTIMATE */}
        <div
          id="bugcrowd-payout-box"
          className="bg-[#090f1d] border border-cyan-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          {/* Top Logo / Label */}
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black border border-cyan-500/40 flex items-center justify-center font-mono font-black text-cyan-400 text-base">
                  BC
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                    BUGCROWD
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-normal">
                      PAYOUT ESTIMATE
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Vulnerability Rating Taxonomy (VRT) Standard
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                {result.bugcrowd.vrtLevel}
              </span>
            </div>

            {/* Payout Display in USD and Live PKR */}
            <div className="space-y-4">
              {/* USD Box */}
              <div className="bg-[#050810] border border-slate-800/90 rounded-lg p-3.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase">
                  ESTIMATED REWARD RANGE (USD)
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 mt-0.5">
                  {isInformational ? (
                    <span className="text-slate-400 font-medium">$0 (No Bounty)</span>
                  ) : (
                    <>
                      {formatUsd(result.bugcrowd.minUsd)}{' '}
                      <span className="text-slate-500 text-lg font-normal">to</span>{' '}
                      {formatUsd(result.bugcrowd.maxUsd)}
                    </>
                  )}
                </div>
                {!isInformational && (
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Expected Average Payout: <strong className="text-white">{formatUsd(result.bugcrowd.avgUsd)} USD</strong>
                  </div>
                )}
              </div>

              {/* PKR Live Converted Box */}
              <div className="bg-[#050810] border border-cyan-500/20 rounded-lg p-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                  <span>LIVE CONVERTED IN PAKISTANI RUPEES (PKR)</span>
                  <span className="text-cyan-400 font-semibold">₨ Live Sync</span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-0.5">
                  {isInformational ? (
                    <span className="text-slate-400 font-medium">₨ 0 PKR</span>
                  ) : (
                    <>
                      <span className="text-cyan-300">{formatPkr(result.bugcrowd.minPkr)}</span>{' '}
                      <span className="text-slate-500 text-base font-normal">to</span>{' '}
                      <span className="text-cyan-300">{formatPkr(result.bugcrowd.maxPkr)}</span>
                    </>
                  )}
                </div>
                {!isInformational && (
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Expected Average in PKR: <strong className="text-cyan-400">{formatPkr(result.bugcrowd.avgPkr)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bugcrowd Platform Advice Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 font-sans leading-relaxed">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{result.bugcrowd.tierNote}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Currency Detail Card */}
      <div className="bg-[#080d18] border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 gap-3">
        <div className="space-y-1">
          <div className="text-slate-200 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Live Interbank USD/PKR Exchange Engine
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Source: {exchangeRate.provider} • Timestamp: {exchangeRate.lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSelectSound();
              onRefreshRate();
            }}
            disabled={exchangeRate.isLoading}
            className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${exchangeRate.isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{exchangeRate.isLoading ? 'Fetching Live Rate...' : 'Force Refresh Live Rate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
