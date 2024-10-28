import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Welcome</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Search Your Chats on ChatGPT
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Experience seamless and secure Chat Storing and chat retireving systems cutting-edge system.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Register</h3>
                <p className="text-base text-gray-500 mb-4">
                  Create a new account to access our services.
                </p>
                <Link href="/register" className="text-base font-semibold text-blue-600 hover:text-blue-500">
                  Register now &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Login</h3>
                <p className="text-base text-gray-500 mb-4">
                  Access your account securely.
                </p>
                <Link href="/login" className="text-base font-semibold text-blue-600 hover:text-blue-500">
                  Login now &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}