'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../utils/axios';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', data);
      localStorage.setItem('token', response.data.token);

      toast.success('Login successful!', { duration: 2000 });

      if (data.role === 'buyer') {
        router.push('/buyer/dashboard');
      } else if (data.role === 'seller') {
        router.push('/seller/dashboard');
      }
    } catch (error: any) {
      console.error('Login failed', error);
      toast.error('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Toaster position="top-right" />

      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Login</h2>

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
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <select
            {...register('role')}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-lg text-lg font-semibold transition duration-300 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
