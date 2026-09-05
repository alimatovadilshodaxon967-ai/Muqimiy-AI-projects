export type AgeGroup = '7-12' | '13-17' | '18-24' | '25-35' | '36-50' | '50+';

export interface UserProfile {
  name: string;
  age: number;
  ageGroup: AgeGroup;
  avatar?: string;
  phone?: string;
  city?: string;
  interest?: string;
}

export interface KioskSession {
  id: string;
  terminalId: string;
  user: UserProfile | null;
  startedAt: string;
  lastActiveAt: string;
  status: 'active' | 'idle' | 'ended';
}

export interface LanguageCourse {
  id: string;
  name: string;
  flag: string;
  description: string;
  levels: string[];
  features: string[];
  externalUrl?: string;
}

export interface CareerDirection {
  id: string;
  title: string;
  icon: string;
  description: string;
  popular: boolean;
  skills: string[];
  averageSalary?: string;
  externalUrl?: string;
}

export interface MigrationCountry {
  id: string;
  name: string;
  flag: string;
  code: string;
  studyInfo: string;
  workInfo: string;
  livingInfo: string;
  requiredLanguage: string;
  inDemandJobs: string[];
  salaryRange: string;
  officialSources: { title: string; url: string; date: string }[];
}

export interface PsychologyCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  status: 'active' | 'maintenance';
}

export interface TerminalStatus {
  id: string;
  name: string;
  status: 'online' | 'idle' | 'offline';
  ip: string;
  uptime: string;
  currentSessionId?: string;
  lastActivity: string;
}

export interface HistoricalTopic {
  id: string;
  title: string;
  icon: string;
  question: string;
  speechText: string;
}

export interface HistoricalFigure {
  id: string;
  name: string;
  fullName: string;
  title: string;
  period: string;
  motto: string;
  shortBio: string;
  portrait: string;
  voice: 'male' | 'female';
  category: 'allomalar' | 'jadidlar' | 'sarkardalar';
  color: string;
  accentBg: string;
  accentBorder: string;
  greetingSpeech: string;
  topics: HistoricalTopic[];
}

