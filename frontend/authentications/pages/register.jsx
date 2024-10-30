import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import {ApiResponse} from '../utils/ApiResponse.js'

export default function Register() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    statusCode: 200,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    setUsernameError('');
    setPasswordError('');
    setNotification({ message: '', statusCode: 200 });

    const formattedUsername = username.toLowerCase();

    if (formattedUsername.length < 3) {
      setUsernameError('Username should be at least 3 characters long');
      hasError = true;
    }

    if (password.length < 8 || password.length > 20) {
      setPasswordError('Password should be between 8 and 20 characters long');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    const registerData = {
      fullName,
      username: formattedUsername,
      email,
      password,
    };

    try {
      const response = await fetch(
        'https://refined-genuinely-husky.ngrok-free.app/api/v1/users/registerUser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();
      const apiResponse = new ApiResponse(response.status, data.message, data);

      // Set notification based on response
      setNotification({
        message: apiResponse.message,
        statusCode: apiResponse.statuscode,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful registration
      console.log('Data parsed successfully:', apiResponse.data);
    } catch (error) {
      console.log('ERROR FETCHING DATA', error);
      setNotification({
        message: 'An error occurred while registering.',
        statusCode: 500,
      });
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Move useEffect to the component level to manage notification timeout
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', statusCode: 200 }); // Clear notification
      }, 3000); // Notification disappears after 3000ms (3 seconds)

      return () => clearTimeout(timer); // Cleanup on component unmount or change
    }
  }, [notification]);

  // Determine the notification color based on the status code
  const notificationColor =
    notification.statusCode < 400
      ? 'bg-green-500'
      : notification.statusCode < 500
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <Layout>
      {/* Notification bar */}
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
                Create your account
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Username input */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                  )}
                </div>

                {/* Full name input */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Email input */}
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

                {/* Password input */}
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
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                {/* Submit button or loading spinner */}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
