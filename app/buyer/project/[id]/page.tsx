'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import API from '@/app/utils/axios';
import Loader from '@/app/components/Loader';
import { Toaster } from 'react-hot-toast';

const statusColors: Record<string, string> = {
  Pending: 'text-red-600',
  progress: 'text-yellow-500',
  Completed: 'text-green-600',
};

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjectAndBids = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue.');
        return;
      }

      const projectResponse = await API.get(`/projects/getProject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bidsResponse = await API.get(`/bids/getBidForProjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProject(projectResponse.data.project);
      setBids(bidsResponse.data.bids);
    } catch (error: any) {
      console.error('Error fetching project details or bids', error);
      setError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndBids();
  }, [id]);

  const selectSeller = async (sellerId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue.');
        return;
      }

      await API.put(
        `/projects/selectSeller`,
        { projectId: id, sellerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Seller selected successfully!');
      fetchProjectAndBids();
    } catch (error) {
      console.error('Error selecting seller', error);
      toast.error('Failed to select seller.');
    }
  };

  const markProjectAsCompleted = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue.');
        return;
      }

      await API.put(
        `/projects/updateStatusOfProject`,
        { status: 'Completed', projectId: Number(id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Project marked as completed!');
      fetchProjectAndBids();
    } catch (error) {
      console.error('Error marking project as completed', error);
      toast.error('Failed to update project status.');
    }
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Project Details */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{project.title}</h2>
          <p className="text-gray-700 mb-3">
            <strong>Description:</strong> {project.description}
          </p>
          <p className={`mb-4 font-semibold ${statusColors[project.status]}`}>
            <strong>Status:</strong> {project.status}
          </p>

          {project.deliverableUrl && (
            <div className="mb-4">
              <strong>Deliverable: </strong>
              <a
                href={project.deliverableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Deliverable
              </a>
            </div>
          )}

          {project.deliverableUrl && project.status === 'In Progress' && (
            <button
              onClick={markProjectAsCompleted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 mt-4"
            >
              Mark as Completed
            </button>
          )}
        </div>

        {/* Bids Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Bids</h3>
          {bids.length > 0 ? (
            <div className="grid gap-4">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="p-5 bg-white rounded-xl shadow-md border border-gray-200"
                >
                  <p className="mb-2">
                    <strong>Bid Amount:</strong> ₹{bid.bidAmount}
                  </p>
                  <p className="mb-2">
                    <strong>Estimated Time:</strong> {bid.estimatedTime}
                  </p>
                  <p className="mb-2">
                    <strong>Message:</strong> {bid.message}
                  </p>
                  <p className="mb-4">
                    <strong>Seller:</strong> {bid.seller.name} ({bid.seller.email})
                  </p>

                  {project.status === 'Pending' && (
                    <button
                      onClick={() => selectSeller(bid.sellerId)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                      Select Seller
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">No bids for this project yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
