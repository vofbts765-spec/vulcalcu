export type SeverityLevel = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';

export type VulnCategory =
  | 'Injection'
  | 'Broken Access Control'
  | 'Authentication & Session'
  | 'Server-Side Attacks'
  | 'Client-Side Attacks'
  | 'API & Microservices'
  | 'Cloud & Infrastructure'
  | 'Business Logic'
  | 'Cryptographic Failures'
  | 'File Handling & Deserialization'
  | 'Information Disclosure'
  | 'Network & Protocols';

export interface VulnOption {
  id: string;
  label: string;
  detail: string;
  scoreModifier: number; // impact on 0-10 base score
  cvssImpact?: {
    c?: 'N' | 'L' | 'H';
    i?: 'N' | 'L' | 'H';
    a?: 'N' | 'L' | 'H';
    pr?: 'N' | 'L' | 'H';
    ui?: 'N' | 'R';
    s?: 'U' | 'C';
  };
  bountyFactor?: number;
}

export interface VulnQuestion {
  id: string;
  title: string;
  description: string;
  options: VulnOption[];
}

export interface VulnerabilityDefinition {
  id: string;
  name: string;
  cwe: string;
  category: VulnCategory;
  shortDesc: string;
  fullDesc: string;
  baseSeverity: SeverityLevel;
  baseCvssScore: number;
  isPopular?: boolean;
  questions: VulnQuestion[];
  remediationAdvice: string;
  typicalHackerOnePayout: {
    minUsd: number;
    maxUsd: number;
  };
  typicalBugcrowdPayout: {
    minUsd: number;
    maxUsd: number;
    vrtTier: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  };
}

export interface CalculationResult {
  score: number; // 0.0 - 10.0
  percentage: number; // 0 - 100%
  severity: SeverityLevel;
  cvssVector: string;
  summary: string;
  impactAnalysis: string[];
  hackerOne: {
    minUsd: number;
    maxUsd: number;
    avgUsd: number;
    minPkr: number;
    maxPkr: number;
    avgPkr: number;
    tierNote: string;
  };
  bugcrowd: {
    minUsd: number;
    maxUsd: number;
    avgUsd: number;
    minPkr: number;
    maxPkr: number;
    avgPkr: number;
    vrtLevel: string;
    tierNote: string;
  };
}

export interface ExchangeRateInfo {
  rate: number;
  lastUpdated: string;
  provider: string;
  isLive: boolean;
  isLoading: boolean;
  error?: string | null;
}
