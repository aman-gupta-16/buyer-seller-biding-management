'use client';

import React, { useEffect, useState } from 'react';
import API from '@/app/utils/axios';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import toast, { Toaster } from 'react-hot-toast';

const SellerAwardedProjects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
    const [uploadingProjectId, setUploadingProjectId] = useState<number | null>(null);
    const router = useRouter();

    const fetchAwardedProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                router.push('/login');
                return;
            }

            const response = await API.get('/projects/awardedBidBySeller', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching awarded projects:', error);
            toast.error('Failed to load awarded projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAwardedProjects();
    }, []);

    const handleFileChange = (projectId: number, file: File) => {
        setSelectedFiles((prev) => ({
            ...prev,
            [projectId]: file,
        }));
    };

    const handleUpload = async (projectId: number) => {
        const file = selectedFiles[projectId];
        if (!file) return toast.error('Please select a file before uploading.');

        const formData = new FormData();
        formData.append('deliverable', file);

        try {
            setUploadingProjectId(projectId);
            const token = localStorage.getItem('token');
            if (!token) return;

            await API.post(`/projects/uploadDeliverables/${projectId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Deliverable uploaded successfully!');
            fetchAwardedProjects(); // Refresh list
        } catch (error) {
            console.error('Error uploading deliverable:', error);
            toast.error('Failed to upload deliverable');
        } finally {
            setUploadingProjectId(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <Toaster position="top-right" />
            <div className="p-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Awarded Projects</h2>

                {projects.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No awarded projects found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                                <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
                                <p className="mb-2 text-gray-700">{project.description}</p>
                                <p className="mb-1"><strong>Budget:</strong> ₹{project.budgetMin} - ₹{project.budgetMax}</p>
                                <p className="mb-1"><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                                <p className="mb-4"><strong>Status:</strong> {project.status}</p>

                                {project.deliverableUrl ? (
                                    <div>
                                        <p className="mb-2 text-green-600 font-semibold">Deliverable Uploaded</p>
                                        <a
                                            href={project.deliverableUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            View Deliverable
                                        </a>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(project.id, e.target.files?.[0] as File)}
                                            className="mb-3 w-full"
                                        />
                                        <button
                                            onClick={() => handleUpload(project.id)}
                                            disabled={uploadingProjectId === project.id}
                                            className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg w-full transition duration-300 ${uploadingProjectId === project.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploadingProjectId === project.id ? 'Uploading...' : 'Upload Deliverable'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SellerAwardedProjects;
