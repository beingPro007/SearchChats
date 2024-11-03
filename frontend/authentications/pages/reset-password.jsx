import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', statuscode: 200 });
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setNotification({
        message: 'Passwords do not match. Please try again.',
        statuscode: 400,
      });
      return;
    }

    try {
      const response = await fetch(
        'https://refined-genuinely-husky.ngrok-free.app/api/v1/users/resetPassword',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword: password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotification({
          message: data.message || 'Password reset successfully. You can now log in with your new password.',
          statuscode: 200,
        });
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setNotification({
          message: data.message || 'Failed to reset password. Please try again.',
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
                Reset Your Password
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}