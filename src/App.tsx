import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ALL_VULNERABILITIES } from './data/vulnerabilities';
import { VulnerabilityDefinition, ExchangeRateInfo } from './types';
import { fetchLiveUsdToPkrRate } from './utils/exchangeRate';
import { calculateSeverityAndBounty } from './utils/calculator';
import { playSelectSound } from './utils/audio';

import { Navbar } from './components/Navbar';
import { VulnerabilitySelectorModal } from './components/VulnerabilitySelectorModal';
import { SeverityMeter } from './components/SeverityMeter';
import { DynamicQuestionForm } from './components/DynamicQuestionForm';
import { BountyEstimator } from './components/BountyEstimator';
import { VulnerabilityDetailsReport } from './components/VulnerabilityDetailsReport';
import { AboutDeveloper } from './components/AboutDeveloper';

import {
  ShieldAlert,
  ChevronDown,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Award,
  Zap,
} from 'lucide-react';

export default function App() {
  // Active selected vulnerability
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityDefinition>(
    ALL_VULNERABILITIES[0] || ({} as VulnerabilityDefinition)
  );

  // Selected options for the current vulnerability's questions
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Target asset scope multiplier (1.0 = standard, 1.3 = core, 0.7 = tier-3)
  const [scopeMultiplier, setScopeMultiplier] = useState<number>(1.0);

  // Vulnerability selector modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Live Exchange Rate state
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateInfo>({
    rate: 278.85,
    lastUpdated: 'Synchronizing...',
    provider: 'Interbank Live Sync',
    isLive: true,
    isLoading: true,
  });

  // Fetch live exchange rate on mount
  const handleRefreshRate = useCallback(async () => {
    setExchangeRate((prev) => ({ ...prev, isLoading: true }));
    const info = await fetchLiveUsdToPkrRate();
    setExchangeRate(info);
  }, []);

  useEffect(() => {
    handleRefreshRate();
  }, [handleRefreshRate]);

  // When selected vulnerability changes, initialize default answers
  const handleSelectVuln = (vuln: VulnerabilityDefinition) => {
    setSelectedVuln(vuln);
    const defaults: Record<string, string> = {};
    for (const q of vuln.questions) {
      if (q.options.length > 0) {
        defaults[q.id] = q.options[0].id;
      }
    }
    setSelectedOptions(defaults);
  };

  // Initialize defaults on mount for first vulnerability
  useEffect(() => {
    if (selectedVuln && selectedVuln.questions) {
      const defaults: Record<string, string> = {};
      for (const q of selectedVuln.questions) {
        if (q.options.length > 0) {
          defaults[q.id] = q.options[0].id;
        }
      }
      setSelectedOptions(defaults);
    }
  }, []);

  // Handle single question option update
  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Quick preset selector
  const handleSelectPreset = (vulnId: string) => {
    const found = ALL_VULNERABILITIES.find((v) => v.id === vulnId);
    if (found) {
      handleSelectVuln(found);
    }
  };

  // Calculate live results
  const calculationResult = useMemo(() => {
    return calculateSeverityAndBounty(
      selectedVuln,
      selectedOptions,
      exchangeRate.rate,
      scopeMultiplier
    );
  }, [selectedVuln, selectedOptions, exchangeRate.rate, scopeMultiplier]);

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Cyber Navigation Bar */}
      <Navbar
        exchangeRate={exchangeRate}
        onRefreshRate={handleRefreshRate}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 overflow-hidden">
        {/* Hero / Quick Selector Action Bar */}
        <section
          id="vuln-selector-hero-bar"
          className="bg-gradient-to-r from-[#09101d] via-[#0c1424] to-[#09101d] border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Background glow */}
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
            {/* Left: Active Vulnerability Headline */}
            <div className="space-y-1.5 sm:space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 whitespace-nowrap">
                  <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  ACTIVE TARGET
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                  CWE: <strong className="text-slate-200">{selectedVuln.cwe}</strong>
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-cyan-400 truncate">
                  Domain: {selectedVuln.category}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-mono font-extrabold text-white tracking-wide break-words">
                {selectedVuln.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-sans leading-relaxed">
                {selectedVuln.shortDesc}
              </p>
            </div>

            {/* Right: The Huge "Select Vulnerability Type" Button */}
            <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-1.5 w-full sm:w-auto">
              <button
                id="open-vuln-selector-modal-btn"
                onClick={() => {
                  playSelectSound();
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-extrabold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[46px]"
              >
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
                <span className="truncate">SELECT VULNERABILITY TYPE</span>
                <ChevronDown className="w-4 h-4 text-black/80 shrink-0" />
              </button>

              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 flex items-center justify-center sm:justify-end gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                Tap to explore <strong>{ALL_VULNERABILITIES.length}+</strong> types
              </span>
            </div>
          </div>
        </section>

        {/* 1. SEVERITY METER (Continuous Horizontal Line from Low to Critical) */}
        <section id="severity-meter-section">
          <SeverityMeter
            result={calculationResult}
            vulnName={selectedVuln.name}
          />
        </section>

        {/* 2. DYNAMIC QUESTIONS & OPTIONS (Zero Typing Required!) */}
        <section id="dynamic-questions-section">
          <DynamicQuestionForm
            vulnerability={selectedVuln}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOption}
            scopeMultiplier={scopeMultiplier}
            onChangeScopeMultiplier={setScopeMultiplier}
          />
        </section>

        {/* 3. BOUNTY ESTIMATOR (HackerOne & Bugcrowd USD & Live PKR) */}
        <section id="bounty-estimator-section">
          <BountyEstimator
            result={calculationResult}
            exchangeRate={exchangeRate}
            onRefreshRate={handleRefreshRate}
          />
        </section>

        {/* 4. TECHNICAL DOSSIER & SUBMISSION REPORT (Markdown Ready) */}
        <section id="technical-dossier-section">
          <VulnerabilityDetailsReport
            vuln={selectedVuln}
            result={calculationResult}
          />
        </section>

        {/* 5. ABOUT DEVELOPER & RESEARCH SECTION */}
        <AboutDeveloper />
      </main>

      {/* Massive Scrollable Vulnerability Catalog Modal */}
      <VulnerabilitySelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vulnerabilities={ALL_VULNERABILITIES}
        selectedVulnId={selectedVuln.id}
        onSelect={handleSelectVuln}
      />

      {/* Cyber Security Footer */}
      <footer className="border-t border-slate-900 bg-[#04060b] mt-8 sm:mt-12 py-5 sm:py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-[11px] sm:text-xs">
              VULN•CALC // Research Project by <strong className="text-slate-300">Abdurrahman</strong>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-slate-400">
            <span>CVSS v3.1 Matrix</span>
            <span>•</span>
            <span>HackerOne &amp; Bugcrowd VRT Aligned</span>
            <span>•</span>
            <span>Live USD/PKR Interbank Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
