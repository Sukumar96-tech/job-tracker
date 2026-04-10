export interface User {
  _id: string;
  email: string;
}

export interface Application {
  _id: string;
  userId: string;
  company: string;
  role: string;
  jdLink?: string;
  extractedSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  notes?: string;
  dateApplied: string;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  salaryRange?: {
    min?: number;
    max?: number;
  };
  resumeSuggestions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export type Status = 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';

export const KANBAN_STATUSES: Status[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
];
