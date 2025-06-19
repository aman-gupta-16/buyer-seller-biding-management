'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/app/utils/axios';
import Loader from '@/app/components/Loader';
import { toast, Toaster } from 'react-hot-toast';

const SellerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login first');
          router.push('/login');
          return;
        }

        const res = await API.get('/projects/getAllPendingProjects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjects(res.data.projects);
        toast.success(res.data.message || 'Projects loaded successfully');
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  if (loading) return <Loader />;

  return (
    <>
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Available Projects</h1>
          <button
            onClick={() => router.push('/seller')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Winning Bids
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project: any) => (
              <div key={project.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-3 text-gray-800">{project.title}</h3>
                <p className="mb-2 text-gray-700">
                  <strong>Budget:</strong> ₹{project.budgetMin} - ₹{project.budgetMax}
                </p>
                <p className="mb-2 text-gray-700">
                  <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-white text-sm mb-4 ${
                    project.status === 'Pending'
                      ? 'bg-red-500'
                      : project.status === 'In Progress'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                >
                  {project.status}
                </span>

                <button
                  onClick={() => router.push(`/seller/project/${project.id}`)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg w-full transition-all duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No pending projects available.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
