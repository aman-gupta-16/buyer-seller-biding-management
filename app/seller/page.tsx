'use client';

import React, { useEffect, useState } from 'react';
import API from '@/app/utils/axios';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';

const SellerAwardedProjects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const fetchAwardedProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await API.get('/projects/awardedBidBySeller', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching awarded projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAwardedProjects();
    }, []);

    const handleFileChange = (e: any) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (projectId: number) => {
        if (!selectedFile) return alert('Please select a file before uploading.');

        const formData = new FormData();
        formData.append('deliverable', selectedFile);

        try {
            setUploading(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await API.post(`/projects/uploadDeliverables/${projectId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Deliverable uploaded successfully!');
            fetchAwardedProjects(); // Refresh list
        } catch (error) {
            console.error('Error uploading deliverable:', error);
            alert('Failed to upload deliverable.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Awarded Projects</h2>
            {projects.length === 0 ? (
                <p className="text-center text-gray-600">No awarded projects found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="mb-2 text-gray-700">{project.description}</p>
                            <p className="mb-1"><strong>Budget:</strong> {project.budgetMin} - {project.budgetMax}</p>
                            <p className="mb-1"><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                            <p className="mb-4"><strong>Status:</strong> {project.status}</p>

                            {project.deliverableUrl ? (
                                <div>
                                    <p className="mb-2 text-green-600">Deliverable Uploaded</p>
                                    <a
                                        href={project.deliverableUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View Deliverable
                                    </a>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="mb-3"
                                    />
                                    <button
                                        onClick={() => handleUpload(project.id)}
                                        className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Deliverable'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerAwardedProjects;
