import React from 'react';
import { ShieldAlert, RefreshCw, Volume2, VolumeX, DollarSign, Activity } from 'lucide-react';
import { ExchangeRateInfo } from '../types';
import { isSoundEnabled, toggleSound, playSelectSound } from '../utils/audio';

interface NavbarProps {
  exchangeRate: ExchangeRateInfo;
  onRefreshRate: () => void;
  onSelectPreset: (vulnId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  exchangeRate,
  onRefreshRate,
  onSelectPreset,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playSelectSound();
  };

  return (
    <header className="border-b border-emerald-950/60 bg-[#070b12]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-wider text-white text-base sm:text-lg">
                VULN<span className="text-emerald-400">CALC</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.4 SEC-OPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Offensive Security Severity & Bug Bounty Estimator
            </p>
          </div>
        </div>

        {/* Right: Live USD/PKR Ticker & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Currency Ticker */}
          <div className="flex items-center gap-2 bg-[#0c121e] border border-emerald-500/20 px-3 py-1.5 rounded-md text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 -mr-1" />
              <span className="font-bold text-slate-200">1 USD</span>
              <span className="text-slate-400">≈</span>
              <span className="font-bold text-emerald-400">₨ {exchangeRate.rate.toFixed(2)} PKR</span>
            </div>

            <button
              id="refresh-currency-btn"
              onClick={onRefreshRate}
              title="Refresh live USD to PKR rate"
              disabled={exchangeRate.isLoading}
              className="p-1 rounded hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${exchangeRate.isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={handleSoundToggle}
            className={`p-2 rounded-md border text-xs font-mono transition-colors flex items-center gap-1.5 ${
              soundOn
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-[#0c121e] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={soundOn ? 'Mute SFX' : 'Enable Cyber SFX'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundOn ? 'SFX ON' : 'SFX'}</span>
          </button>

          {/* Quick Presets Dropdown */}
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1">Quick:</span>
            <button
              onClick={() => onSelectPreset('sqli')}
              className="px-2 py-1 rounded bg-[#0c121e] hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/30 text-[11px] font-mono text-slate-300 hover:text-emerald-300"
            >
              SQLi
            </button>
            <button
              onClick={() => onSelectPreset('ssrf')}
              className="px-2 py-1 rounded bg-[#0c121e] hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/30 text-[11px] font-mono text-slate-300 hover:text-emerald-300"
            >
              SSRF
            </button>
            <button
              onClick={() => onSelectPreset('idor')}
              className="px-2 py-1 rounded bg-[#0c121e] hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/30 text-[11px] font-mono text-slate-300 hover:text-emerald-300"
            >
              IDOR
            </button>
            <button
              onClick={() => onSelectPreset('rce')}
              className="px-2 py-1 rounded bg-[#0c121e] hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/30 text-[11px] font-mono text-slate-300 hover:text-emerald-300"
            >
              RCE
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
