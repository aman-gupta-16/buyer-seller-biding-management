'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../../utils/axios';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import toast, { Toaster } from 'react-hot-toast';

const SellerRegister = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await API.post('/auth/registerSeller', data);
      toast.success('Registration successful! Please login.', { duration: 2000 });
      router.push('/login');
    } catch (error) {
      console.error('Registration failed', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Seller Registration</h2>

          <input
            {...register('name')}
            placeholder="Name"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full py-3 rounded-lg text-lg font-semibold transition duration-300 cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default SellerRegister;
