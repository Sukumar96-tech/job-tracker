import React, { useState } from 'react';
import { Application } from '../types';
import { applicationAPI } from '../api/client';

interface ApplicationDetailModalProps {
  application: Application;
  onClose: () => void;
  onUpdate: (app: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationDetailModal({
  application,
  onClose,
  onUpdate,
  onDelete,
}: ApplicationDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>(application);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await applicationAPI.update(
        application._id,
        formData
      );
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    setLoading(true);
    try {
      await applicationAPI.delete(application._id);
      onDelete(application._id);
      onClose();
    } catch (error) {
      console.error('Failed to delete application');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResumeSuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion);
    alert('Copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{formData.company}</h2>
            <p className="text-blue-100">{formData.role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 font-bold text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'Applied'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as any,
                    })
                  }
                  className="input-field"
                >
                  <option>Applied</option>
                  <option>Phone Screen</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="input-field min-h-24"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formData.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Location</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formData.location || 'N/A'}
                  </p>
                </div>
              </div>

              {formData.seniority && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Seniority</p>
                  <p className="text-gray-800">{formData.seniority}</p>
                </div>
              )}

              {formData.extractedSkills && formData.extractedSkills.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.extractedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.niceToHaveSkills &&
                formData.niceToHaveSkills.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">
                      Nice to Have
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.niceToHaveSkills.map((skill) => (
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

              {formData.resumeSuggestions &&
                formData.resumeSuggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">
                      Resume Suggestions
                    </p>
                    <div className="space-y-2">
                      {formData.resumeSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="bg-yellow-50 border border-yellow-200 p-3 rounded flex justify-between items-start"
                        >
                          <p className="text-sm text-gray-700">{suggestion}</p>
                          <button
                            onClick={() =>
                              handleCopyResumeSuggestion(suggestion)
                            }
                            className="text-yellow-600 hover:text-yellow-800 ml-2"
                          >
                            📋
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {formData.notes && (
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-2">Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {formData.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors flex-1 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
