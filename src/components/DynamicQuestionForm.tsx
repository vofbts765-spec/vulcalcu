import React from 'react';
import { VulnerabilityDefinition } from '../types';
import { CheckCircle, Circle, HelpCircle, Target, Sparkles } from 'lucide-react';
import { playSelectSound } from '../utils/audio';

interface DynamicQuestionFormProps {
  vulnerability: VulnerabilityDefinition;
  selectedOptions: Record<string, string>;
  onSelectOption: (questionId: string, optionId: string) => void;
  scopeMultiplier: number;
  onChangeScopeMultiplier: (multiplier: number) => void;
}

export const DynamicQuestionForm: React.FC<DynamicQuestionFormProps> = ({
  vulnerability,
  selectedOptions,
  onSelectOption,
  scopeMultiplier,
  onChangeScopeMultiplier,
}) => {
  const handleOptionClick = (questionId: string, optionId: string) => {
    playSelectSound();
    onSelectOption(questionId, optionId);
  };

  const handleScopeClick = (multiplier: number) => {
    playSelectSound();
    onChangeScopeMultiplier(multiplier);
  };

  return (
    <div id="dynamic-questions-container" className="space-y-6">
      {/* Questionnaire Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950/80 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-mono font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            TAILORED ATTACK SCENARIO & IMPACT QUESTIONS
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Zero typing required. Select how you exploited this specific {vulnerability.name} to calculate exact severity and bounty payouts.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded bg-[#0c1424] border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{vulnerability.questions.length} Tailored Questions</span>
        </div>
      </div>

      {/* Target Asset Tier / Scope Selector */}
      <div className="bg-[#0a0f1d] border border-slate-800/90 rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            TARGET ASSET TIER / PROGRAM SCOPE
          </span>
          <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
            (Determines bounty reward pool scaling on HackerOne &amp; Bugcrowd)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleScopeClick(1.3)}
            className={`p-3 rounded-lg border text-left transition-all ${
              scopeMultiplier === 1.3
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                : 'bg-[#080d18] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-xs text-emerald-400">CORE TIER-1 ASSET</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                1.3x Payout
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Main production API, core customer web app, authentication portal (*.domain.com)
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleScopeClick(1.0)}
            className={`p-3 rounded-lg border text-left transition-all ${
              scopeMultiplier === 1.0
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                : 'bg-[#080d18] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-xs text-cyan-400">STANDARD IN-SCOPE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                1.0x Payout
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Standard secondary in-scope applications, developer portals, or marketing assets
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleScopeClick(0.7)}
            className={`p-3 rounded-lg border text-left transition-all ${
              scopeMultiplier === 0.7
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                : 'bg-[#080d18] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-xs text-amber-400">TIER-3 / SUBSIDIARY</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                0.7x Payout
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Recently acquired subsidiaries, legacy staging servers, or sandbox demo domains
            </p>
          </button>
        </div>
      </div>

      {/* Questions Stack */}
      {vulnerability.questions.map((question, qIndex) => {
        const currentSelectedId = selectedOptions[question.id] || question.options[0]?.id;

        return (
          <div
            key={question.id}
            id={`question-card-${question.id}`}
            className="bg-[#090e1a] border border-slate-800 rounded-xl p-4 sm:p-5 transition-all hover:border-slate-700"
          >
            {/* Question Header */}
            <div className="flex items-start gap-2.5 mb-3">
              <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                STEP {String(qIndex + 1).padStart(2, '0')}
              </div>
              <div>
                <h4 className="font-mono font-bold text-white text-sm sm:text-base">
                  {question.title}
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-0.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                  {question.description}
                </p>
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-2.5 mt-3">
              {question.options.map((option) => {
                const isSelected = currentSelectedId === option.id;

                return (
                  <div
                    key={option.id}
                    id={`option-${question.id}-${option.id}`}
                    onClick={() => handleOptionClick(question.id, option.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/90 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                        : 'bg-[#060a12] border-slate-800/80 hover:border-slate-700 hover:bg-[#080d18]'
                    }`}
                  >
                    {/* Radio Indicator */}
                    <div className="mt-0.5 shrink-0 text-emerald-400">
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 fill-emerald-500 text-black" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    {/* Option Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span
                          className={`font-mono text-xs sm:text-sm font-semibold transition-colors ${
                            isSelected ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {option.label}
                        </span>

                        {/* Score Modifier Badge */}
                        <span
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                            option.scoreModifier > 0
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : option.scoreModifier < 0
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {option.scoreModifier > 0
                            ? `+${option.scoreModifier} Impact`
                            : option.scoreModifier < 0
                            ? `${option.scoreModifier} Impact`
                            : 'Baseline'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 font-sans mt-1">
                        {option.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
