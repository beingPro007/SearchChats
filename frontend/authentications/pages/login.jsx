import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout.jsx';
import { ApiResponse } from '../../../utils/ApiResponse.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    statuscode: 200,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://16bc-152-59-32-218.ngrok-free.app/api/v1/users/loginUser',
        {
          method: 'POST',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Send email and password only
        }
      );

      const data = await response.json();

      // Check if the response is successful
      if (response.ok) {
        setNotification({
          message: data.message,
          statuscode: 200,
        });
        window.close();
      } else {
        // Display error from the backend response
        setNotification({
          message: data.message || 'Login failed. Please try again.',
          statuscode: response.status,
        });
      }
    } catch (error) {
      setNotification({
        message: 'Error: Unable to login. Please check your credentials.',
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
        >
          <p className="text-center">{notification.message}</p>
        </div>
      )}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
