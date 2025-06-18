'use client';

import React, { useEffect, useState } from 'react';
import ProjectCard from '@/app/components/ProjectCard';
import { useRouter } from 'next/navigation';
import API from '@/app/utils/axios';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '@/app/components/Loader';

const BuyerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login first!');
          router.push('/login');
          return;
        }

        const response = await API.get('/projects/getProjectsByBuyer', {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(response.data.message);
        setProjects(response.data.projects);
      } catch (error: any) {
        console.error('Error fetching projects', error);
        setError('Failed to load your projects. Please try again later.');
        toast.error('Error fetching projects!');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
          <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={() => router.push('/buyer/create')}
          >
            + Add New Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={() => router.push(`/buyer/project/${project.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-gray-500 text-lg">No projects found. Start by adding a new one!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BuyerDashboard;
