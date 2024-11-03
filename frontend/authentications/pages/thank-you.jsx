import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function ThankYou() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
                Thank You
              </h2>
              <p className="text-center text-gray-600 mb-6">
                We've sent you an email with instructions to reset your password.
              </p>
              <p className="text-center text-gray-600 mb-6">
                Please check your email inbox and follow the instructions to reset your password. If you don't see the email, please check your spam folder.
              </p>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}