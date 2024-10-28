import Link from 'next/link'
import { Github } from 'lucide-react' // Make sure Github icon is imported

export default function Layout({
  children,
  repoUrl = 'https://github.com/beingPro007/SearchChats.git'
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 bg-opacity-50 bg-grid-pattern">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  Search Chats
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/register"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Search Chats. All rights reserved.
            </p>
            <Link
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Github className="h-5 w-5 mr-2" />
              Contribute on GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
