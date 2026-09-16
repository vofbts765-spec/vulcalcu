import { CalculationResult, VulnerabilityDefinition, SeverityLevel } from '../types';

export function calculateSeverityAndBounty(
  vuln: VulnerabilityDefinition,
  selectedOptions: Record<string, string>,
  usdToPkrRate: number,
  targetScopeMultiplier: number = 1.0 // 1.0 = standard, 1.4 = top-tier core asset, 0.7 = minor asset
): CalculationResult {
  // Start from base CVSS score
  let currentScore = vuln.baseCvssScore;
  const impactAnalysis: string[] = [];
  let bountyMultiplier = 1.0;

  // Track CVSS metric overrides
  let cImpact: 'N' | 'L' | 'H' = 'L';
  let iImpact: 'N' | 'L' | 'H' = 'N';
  let aImpact: 'N' | 'L' | 'H' = 'N';
  let prRequirement: 'N' | 'L' | 'H' = 'N';
  let uiRequirement: 'N' | 'R' = 'N';

  // Iterate over questions and apply selected option modifiers
  for (const question of vuln.questions) {
    const selectedOptionId = selectedOptions[question.id];
    if (selectedOptionId) {
      const option = question.options.find((opt) => opt.id === selectedOptionId);
      if (option) {
        currentScore += option.scoreModifier;
        impactAnalysis.push(`${question.title}: ${option.label}`);

        if (option.cvssImpact) {
          if (option.cvssImpact.c) cImpact = option.cvssImpact.c;
          if (option.cvssImpact.i) iImpact = option.cvssImpact.i;
          if (option.cvssImpact.a) aImpact = option.cvssImpact.a;
          if (option.cvssImpact.pr) prRequirement = option.cvssImpact.pr;
          if (option.cvssImpact.ui) uiRequirement = option.cvssImpact.ui;
        }

        if (option.bountyFactor !== undefined) {
          bountyMultiplier *= option.bountyFactor;
        }
      }
    }
  }

  // Clamp score
  if (vuln.baseSeverity === 'Informational' && currentScore < 1.0) {
    currentScore = 0.0;
  } else {
    currentScore = Math.max(0.0, Math.min(10.0, Math.round(currentScore * 10) / 10));
  }

  // Determine Severity Level
  let severity: SeverityLevel = 'Informational';
  if (currentScore === 0) {
    severity = 'Informational';
  } else if (currentScore <= 3.9) {
    severity = 'Low';
  } else if (currentScore <= 6.9) {
    severity = 'Medium';
  } else if (currentScore <= 8.9) {
    severity = 'High';
  } else {
    severity = 'Critical';
  }

  const percentage = Math.round(currentScore * 10);

  // Synthesize CVSS v3.1 vector string
  const av = 'N';
  const ac = 'L';
  const cvssVector = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${prRequirement}/UI:${uiRequirement}/S:U/C:${cImpact}/I:${iImpact}/A:${aImpact}`;

  // HackerOne and Bugcrowd payouts calculation
  let h1MinUsd = 0;
  let h1MaxUsd = 0;
  let bcMinUsd = 0;
  let bcMaxUsd = 0;
  let vrtLevel = 'P5';

  if (severity === 'Informational') {
    h1MinUsd = 0;
    h1MaxUsd = 0;
    bcMinUsd = 0;
    bcMaxUsd = 0;
    vrtLevel = 'P5 (Informational)';
  } else {
    // Relative scaling based on score relative to base
    const scoreFactor = Math.max(0.2, currentScore / Math.max(1, vuln.baseCvssScore));
    const finalFactor = scoreFactor * targetScopeMultiplier * bountyMultiplier;

    h1MinUsd = Math.round((vuln.typicalHackerOnePayout.minUsd * finalFactor) / 50) * 50;
    h1MaxUsd = Math.round((vuln.typicalHackerOnePayout.maxUsd * finalFactor) / 100) * 100;

    bcMinUsd = Math.round((vuln.typicalBugcrowdPayout.minUsd * finalFactor) / 50) * 50;
    bcMaxUsd = Math.round((vuln.typicalBugcrowdPayout.maxUsd * finalFactor) / 100) * 100;

    if (severity === 'Critical') {
      vrtLevel = 'P1 (Critical Impact)';
      h1MinUsd = Math.max(2500, h1MinUsd);
      bcMinUsd = Math.max(2000, bcMinUsd);
    } else if (severity === 'High') {
      vrtLevel = 'P2 (High Impact)';
      h1MinUsd = Math.max(1000, h1MinUsd);
      bcMinUsd = Math.max(800, bcMinUsd);
    } else if (severity === 'Medium') {
      vrtLevel = 'P3 (Medium Impact)';
      h1MinUsd = Math.max(300, h1MinUsd);
      bcMinUsd = Math.max(250, bcMinUsd);
    } else {
      vrtLevel = 'P4 (Low Impact)';
      h1MinUsd = Math.max(100, h1MinUsd);
      bcMinUsd = Math.max(100, bcMinUsd);
    }
  }

  const h1AvgUsd = Math.round((h1MinUsd + h1MaxUsd) / 2);
  const bcAvgUsd = Math.round((bcMinUsd + bcMaxUsd) / 2);

  const h1MinPkr = Math.round(h1MinUsd * usdToPkrRate);
  const h1MaxPkr = Math.round(h1MaxUsd * usdToPkrRate);
  const h1AvgPkr = Math.round(h1AvgUsd * usdToPkrRate);

  const bcMinPkr = Math.round(bcMinUsd * usdToPkrRate);
  const bcMaxPkr = Math.round(bcMaxUsd * usdToPkrRate);
  const bcAvgPkr = Math.round(bcAvgUsd * usdToPkrRate);

  let h1TierNote = '';
  let bcTierNote = '';

  if (severity === 'Informational') {
    h1TierNote = 'Informational findings typically receive $0 (Not Applicable). Some programs reward with swag or reputation points.';
    bcTierNote = 'Bugcrowd classifies this under VRT P5. Standard policy provides $0 cash reward, only Kudos points or hall-of-fame acknowledgment.';
  } else if (severity === 'Critical') {
    h1TierNote = 'Top-tier bounty reward on HackerOne programs. Triaged urgently within 1-2 hours by HackerOne staff.';
    bcTierNote = 'Assigned Priority 1 (P1). Priority queue triage with accelerated reward payout.';
  } else if (severity === 'High') {
    h1TierNote = 'High severity payout tier. Significant impact on customer data integrity or system access.';
    bcTierNote = 'Assigned Priority 2 (P2). Solid cash payout across standard and private programs.';
  } else if (severity === 'Medium') {
    h1TierNote = 'Standard medium severity bounty tier. Common for stored XSS or non-critical authorization bypasses.';
    bcTierNote = 'Assigned Priority 3 (P3). Standard bounty pool eligibility.';
  } else {
    h1TierNote = 'Low severity reward. Requires low user interaction or minimal sensitive data exposure.';
    bcTierNote = 'Assigned Priority 4 (P4). Eligible for entry-tier bounties on paid bounty programs.';
  }

  const summary = `Evaluated as ${severity} severity (${currentScore.toFixed(1)}/10.0, ${percentage}%) based on ${vuln.name}. Attack vector requires ${prRequirement === 'N' ? 'unauthenticated access' : prRequirement === 'L' ? 'low-privilege credentials' : 'administrative rights'} with ${cImpact === 'H' ? 'high confidentiality breach' : cImpact === 'L' ? 'limited data disclosure' : 'no direct data leak'}.`;

  return {
    score: currentScore,
    percentage,
    severity,
    cvssVector,
    summary,
    impactAnalysis,
    hackerOne: {
      minUsd: h1MinUsd,
      maxUsd: h1MaxUsd,
      avgUsd: h1AvgUsd,
      minPkr: h1MinPkr,
      maxPkr: h1MaxPkr,
      avgPkr: h1AvgPkr,
      tierNote: h1TierNote,
    },
    bugcrowd: {
      minUsd: bcMinUsd,
      maxUsd: bcMaxUsd,
      avgUsd: bcAvgUsd,
      minPkr: bcMinPkr,
      maxPkr: bcMaxPkr,
      avgPkr: bcAvgPkr,
      vrtLevel,
      tierNote: bcTierNote,
    },
  };
}
