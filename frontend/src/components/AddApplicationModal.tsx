import React, { useState } from 'react';
import { applicationAPI } from '../api/client';
import { Application, ParsedJobDescription } from '../types';

interface AddApplicationModalProps {
  onClose: () => void;
  onApplicationCreated: (app: Application) => void;
}

export function AddApplicationModal({
  onClose,
  onApplicationCreated,
}: AddApplicationModalProps) {
  const [step, setStep] = useState<'paste' | 'review' | 'suggestions'>(
    'paste'
  );
  const [jobDescription, setJobDescription] = useState('');
  const [parsed, setParsed] = useState<ParsedJobDescription | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  const handleParse = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await applicationAPI.parseJobDescription(
        jobDescription
      );
      setParsed(response.data);
      
      // Generate suggestions
      const suggestionsResponse =
        await applicationAPI.generateSuggestions(
          response.data.role,
          response.data.company,
          response.data.requiredSkills
        );
      setSuggestions(suggestionsResponse.data.suggestions);
      
      setStep('review');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to parse job description'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parsed) return;

    setLoading(true);
    setError('');

    try {
      const applicationData = {
        company: parsed.company,
        role: parsed.role,
        jdLink: '',
        extractedSkills: parsed.requiredSkills,
        niceToHaveSkills: parsed.niceToHaveSkills,
        seniority: parsed.seniority,
        location: parsed.location,
        notes,
        status: 'Applied',
        resumeSuggestions: suggestions,
        dateApplied: new Date(),
      };

      const response = await applicationAPI.create(applicationData);
      onApplicationCreated(response.data);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create application'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add Job Application</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 font-bold text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the entire job description here..."
                  className="input-field min-h-80"
                />
              </div>

              <button
                onClick={handleParse}
                disabled={loading || !jobDescription.trim()}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Parsing...' : 'Parse with AI'}
              </button>
            </div>
          )}

          {step === 'review' && parsed && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-3">Parsed Details</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Company</p>
                    <p className="text-gray-800 font-semibold">{parsed.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Role</p>
                    <p className="text-gray-800 font-semibold">{parsed.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Location</p>
                    <p className="text-gray-800 font-semibold">
                      {parsed.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Seniority</p>
                    <p className="text-gray-800 font-semibold">
                      {parsed.seniority}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parsed.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {parsed.niceToHaveSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase mb-2">
                      Nice to Have
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {parsed.niceToHaveSkills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any personal notes about this application..."
                  className="input-field min-h-24"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('paste')}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Application'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
