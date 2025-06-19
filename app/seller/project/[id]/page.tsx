'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import API from '@/app/utils/axios';
import Loader from '@/app/components/Loader';

const SellerProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form States
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [message, setMessage] = useState('');
  const [bidLoading, setBidLoading] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        router.push('/login');
        return;
      }

      const projectResponse = await API.get(`/projects/getProject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProject(projectResponse.data.project);
    } catch (error: any) {
      console.error('Error fetching project details', error);
      setError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleCreateBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bidAmount || !estimatedTime || !message) {
      toast.error('All fields are required.');
      return;
    }

    try {
      setBidLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      await API.post(
        '/bids/createNewBid',
        {
          projectId: project.id,
          bidAmount: Number(bidAmount),
          estimatedTime,
          message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Bid placed successfully!');
      router.push('/seller/dashboard');
    } catch (error) {
      console.error('Error creating bid:', error);
      toast.error('Failed to place bid.');
    } finally {
      setBidLoading(false);
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
        {/* Project Details Card */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{project.title}</h2>
          <p className="text-gray-700 mb-3">
            <strong>Description:</strong> {project.description}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Budget Min:</strong> ₹{project.budgetMin}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Budget Max:</strong> ₹{project.budgetMax}
          </p>
          <p className="text-gray-700 mb-3">
            <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
          </p>
        </div>

        {/* Place Bid Form */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Place Your Bid</h3>
          <form onSubmit={handleCreateBid} className="space-y-4">
            <input
              type="number"
              placeholder="Bid Amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              placeholder="Estimated Time (e.g. 5 days)"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              rows={4}
            />

            <button
              type="submit"
              disabled={bidLoading}
              className={`mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition-transform duration-300 transform hover:scale-105 w-full ${
                bidLoading && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {bidLoading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SellerProjectDetails;
