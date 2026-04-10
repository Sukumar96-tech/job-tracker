import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { AddApplicationModal } from './AddApplicationModal';
import { applicationAPI } from '../api/client';
import { Application, KANBAN_STATUSES, Status } from '../types';
import { useAppStore } from '../store';

interface KanbanBoardProps {
  onLogout: () => void;
}

export function KanbanBoard({ onLogout }: KanbanBoardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const applications = useAppStore((state) => state.applications);
  const setApplications = useAppStore((state) => state.setApplications);
  const updateApplication = useAppStore((state) => state.updateApplication);
  const removeApplication = useAppStore((state) => state.removeApplication);
  const addApplication = useAppStore((state) => state.addApplication);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await applicationAPI.getAll();
      setApplications(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch applications'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId as Status;
    const application = applications.find((a) => a._id === draggableId);

    if (!application || application.status === newStatus) return;

    // Optimistic update
    const updatedApp = { ...application, status: newStatus };
    updateApplication(updatedApp);

    // Persist to backend
    try {
      await applicationAPI.update(draggableId, { status: newStatus });
    } catch (err) {
      // Revert on error
      updateApplication(application);
      console.error('Failed to update status');
      alert('Failed to update application status. Please try again.');
    }
  };

  const getApplicationsByStatus = (status: Status) => {
    return applications.filter((app) => app.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Job Application Tracker</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 px-4 rounded transition-colors"
            >
              + Add Application
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 font-bold py-2 px-4 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">No applications yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Start Tracking Your Applications
            </button>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="p-6 overflow-x-auto">
            <div className="flex gap-6 min-w-full">
              {KANBAN_STATUSES.map((status) => (
                <Droppable key={status} droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-100' : ''
                      }`}
                    >
                      <h2 className="font-bold text-gray-800 mb-4">
                        {status}
                        <span className="ml-2 text-sm text-gray-600">
                          ({getApplicationsByStatus(status).length})
                        </span>
                      </h2>

                      <div className="space-y-3">
                        {getApplicationsByStatus(status).map(
                          (application, index) => (
                            <Draggable
                              key={application._id}
                              draggableId={application._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-opacity ${
                                    snapshot.isDragging
                                      ? 'opacity-50'
                                      : 'opacity-100'
                                  }`}
                                >
                                  <ApplicationCard
                                    application={application}
                                    onClick={setSelectedApplication}
                                  />
                                </div>
                              )}
                            </Draggable>
                          )
                        )}
                      </div>

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>
      )}

      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onApplicationCreated={addApplication}
        />
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={updateApplication}
          onDelete={removeApplication}
        />
      )}
    </div>
  );
}
