import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    statuscode: 200,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
      'https://searchchats-backend-1060514353958.us-central1.run.app/api/v1/users/forgotPassword',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotification({
          message: data.message || 'Password reset email sent successfully.',
          statuscode: 200,
        });
        // Redirect to thank you page
        window.location.href = '/thank-you';
      } else {
        setNotification({
          message: data.message || 'Failed to send reset email. Please try again.',
          statuscode: response.status,
        });
      }
    } catch (error) {
      setNotification({
        message: 'Error: Unable to process your request. Please try again later.',
        statuscode: 500,
      });
    }
  };

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', statuscode: 200 });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const notificationColor =
    notification.statuscode < 400
      ? 'bg-green-500'
      : notification.statuscode < 500
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <Layout>
      {notification.message && (
        <div
          className={`fixed top-0 left-0 right-0 p-4 text-white ${notificationColor}`}
          role="alert"
          aria-live="assertive"
        >
          <p className="text-center">{notification.message}</p>
        </div>
      )}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
                Forgot Password
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-center text-gray-600">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}