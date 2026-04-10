import React from 'react';
import { Application, Status } from '../types';

interface ApplicationCardProps {
  application: Application;
  onClick: (app: Application) => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  return (
    <div
      onClick={() => onClick(application)}
      className="card cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 border-l-4 border-blue-500 mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-800">{application.company}</h3>
          <p className="text-sm text-gray-600">{application.role}</p>
        </div>
      </div>

      {application.location && (
        <p className="text-xs text-gray-500 mb-2">📍 {application.location}</p>
      )}

      {application.extractedSkills && application.extractedSkills.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {application.extractedSkills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
            {application.extractedSkills.length > 2 && (
              <span className="text-xs text-gray-500">
                +{application.extractedSkills.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">
        {new Date(application.dateApplied).toLocaleDateString()}
      </p>
    </div>
  );
}
