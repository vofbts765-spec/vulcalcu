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
      <div className="bg-[#0a0f1d] border border-slate-800/90 rounded-xl p-3.5 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] sm:text-xs font-bold text-slate-200 uppercase tracking-wider">
            TARGET SCOPE TIER
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans hidden sm:inline">
            (Determines bounty reward pool scaling on HackerOne &amp; Bugcrowd)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => handleScopeClick(1.3)}
            className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all min-h-[44px] ${
              scopeMultiplier === 1.3
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                : 'bg-[#080d18] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-mono font-bold text-[11px] sm:text-xs text-emerald-400 truncate">
                CORE TIER-1 ASSET
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 whitespace-nowrap shrink-0">
                1.3x Payout
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">
              Main production API, core web app (*.domain.com)
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleScopeClick(1.0)}
            className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all min-h-[44px] ${
              scopeMultiplier === 1.0
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                : 'bg-[#080d18] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-mono font-bold text-[11px] sm:text-xs text-cyan-400 truncate">
                STANDARD IN-SCOPE
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 whitespace-nowrap shrink-0">
                1.0x Payout
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">
              Standard secondary in-scope applications, developer portals
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleScopeClick(0.7)}
            className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all min-h-[44px] ${
              scopeMultiplier === 0.7
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                : 'bg-[#080d18] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-mono font-bold text-[11px] sm:text-xs text-amber-400 truncate">
                TIER-3 / SUBSIDIARY
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 whitespace-nowrap shrink-0">
                0.7x Payout
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">
              Subsidiaries, legacy staging servers, or sandbox demo domains
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
            className="bg-[#090e1a] border border-slate-800 rounded-xl p-3.5 sm:p-5 transition-all hover:border-slate-700"
          >
            {/* Question Header */}
            <div className="flex items-start gap-2 sm:gap-2.5 mb-2.5 sm:mb-3">
              <div className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold shrink-0 mt-0.5">
                STEP {String(qIndex + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0">
                <h4 className="font-mono font-bold text-white text-xs sm:text-base leading-snug break-words">
                  {question.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400 font-sans mt-0.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400/80 shrink-0" />
                  <span>{question.description}</span>
                </p>
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 mt-2 sm:mt-3">
              {question.options.map((option) => {
                const isSelected = currentSelectedId === option.id;

                return (
                  <div
                    key={option.id}
                    id={`option-${question.id}-${option.id}`}
                    onClick={() => handleOptionClick(question.id, option.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 sm:gap-3 select-none min-h-[44px] active:scale-[0.99] ${
                      isSelected
                        ? 'bg-emerald-950/35 border-emerald-500/90 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                        <span
                          className={`font-mono text-xs sm:text-sm font-semibold transition-colors leading-snug ${
                            isSelected ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {option.label}
                        </span>

                        {/* Score Modifier Badge */}
                        <span
                          className={`text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 sm:px-2 py-0.5 rounded self-start sm:self-center shrink-0 ${
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

                      <p className="text-[11px] sm:text-xs text-slate-400 font-sans mt-1 leading-relaxed">
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
