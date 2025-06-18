'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import API from '@/app/utils/axios';
import toast, { Toaster } from 'react-hot-toast';

const CreateProject = () => {
    const { register, handleSubmit, reset } = useForm();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error('Please login first.');
                router.push('/login');
                return;
            }

            const payload = {
                title: data.title,
                description: data.description,
                budgetMin: Number(data.budgetMin),
                budgetMax: Number(data.budgetMax),
                deadline: data.deadline,
            };

            await API.post("/projects/createNewProject", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Project created successfully!', { duration: 2000 });
            reset(); 
            setTimeout(() => {
                router.push('/buyer/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white p-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg"
                >
                    <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Create New Project</h2>

                    <div className="space-y-5">
                        <input
                            {...register('title')}
                            placeholder="Project Title"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />

                        <textarea
                            {...register('description')}
                            placeholder="Project Description"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                            rows={4}
                        />

                        <div className="flex space-x-4">
                            <input
                                {...register('budgetMin')}
                                type="number"
                                placeholder="Minimum Budget"
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            <input
                                {...register('budgetMax')}
                                type="number"
                                placeholder="Maximum Budget"
                                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <input
                            {...register('deadline')}
                            type="date"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full py-4 rounded-xl text-lg font-semibold transition-transform duration-300 transform hover:scale-105"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateProject;
