export interface User {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
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
  dateApplied: Date;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  salaryRange?: {
    min?: number;
    max?: number;
  };
  resumeSuggestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
