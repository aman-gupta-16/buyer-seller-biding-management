'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import API from '@/app/utils/axios';
import Loader from '@/app/components/Loader';

const ProjectDetails = () => {
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

    const fetchProjectAndBids = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

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
        fetchProjectAndBids();
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
            router.push('/seller/dashboard'); // Redirect to seller dashboard after bid
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
        <div className="p-6">
            {/* Project Details */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
                <p className="text-gray-700 mb-2"><strong>Description:</strong> {project.description}</p>
                <p className="mb-1"><span className="font-semibold">Budget Min:</span> {project.budgetMin}</p>
                <p className="mb-1"><span className="font-semibold">Budget Max:</span> {project.budgetMax}</p>
                <p className="mb-3"><span className="font-semibold">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>
            </div>

            {/* Create Bid Form */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Place Your Bid</h3>
                <form onSubmit={handleCreateBid} className="space-y-4">
                    <input
                        type="number"
                        placeholder="Bid Amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Estimated Time (e.g. 5 days)"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />

                    <button
                        type="submit"
                        disabled={bidLoading}
                        className={`bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg w-full text-lg font-semibold transition duration-300 ${bidLoading && 'opacity-50 cursor-not-allowed'}`}
                    >
                        {bidLoading ? 'Placing Bid...' : 'Place Bid'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProjectDetails;
