import mongoose from 'mongoose';
import { Application } from '../types/index.js';

const applicationSchema = new mongoose.Schema<Application>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    jdLink: {
      type: String,
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    niceToHaveSkills: {
      type: [String],
      default: [],
    },
    seniority: {
      type: String,
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    salaryRange: {
      min: Number,
      max: Number,
    },
    resumeSuggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ApplicationModel = mongoose.model<Application>(
  'Application',
  applicationSchema
);
