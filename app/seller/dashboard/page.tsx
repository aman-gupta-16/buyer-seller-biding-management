'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/app/utils/axios';

const SellerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await API.get('/projects/getAllPendingProjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;

  return (<> 
 <div className='flex justify-end'>
      <button className='bg-purple-600 rounded-md p-2 text-white cursor-pointer' onClick={() => router.push("/seller")}>Winning bid</button>

    </div>
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {projects.length > 0 ? (
      projects.map((project: any) => (
        <div key={project.id} className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="mb-2"><strong>Budget:</strong> ${project.budgetMin} - ${project.budgetMax}</p>
          <p className="mb-2"><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>

          <span
            className={`inline-block px-3 py-1 rounded-full text-white text-sm mb-4 ${project.status === 'pending' ? 'bg-red-500' :
                project.status === 'inProgress' ? 'bg-yellow-500' :
                  'bg-green-500'
              }`}
          >
            {project.status}
          </span>

          <button
            onClick={() => router.push(`/seller/project/${project.id}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg w-full transition duration-300"
          >
            View Details
          </button>
        </div>
      ))
    ) : (
      <p className="text-center col-span-3 text-lg">No pending projects available.</p>
    )}
  </div>
  </>

  );
};

export default SellerDashboard;
