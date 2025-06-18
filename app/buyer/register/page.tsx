'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../../utils/axios';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

const BuyerRegister = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await API.post('/auth/registerBuyer', data);
      toast.success('Registration successful!');
      router.push('/login');
    } catch (error: any) {
      console.error('Registration failed', error);
      toast.error(error?.response?.data?.message || 'Registration failed!');
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
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Buyer Registration</h2>

          <div className="space-y-5">
            <div>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Name"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="Email"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                type="password"
                placeholder="Password"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full py-4 rounded-xl text-lg font-semibold transition-transform duration-300 transform hover:scale-105 ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </>
  );
};

export default BuyerRegister;
