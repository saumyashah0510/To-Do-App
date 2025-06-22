import { Outlet } from 'react-router-dom'
import { FaGithub, FaInstagram } from 'react-icons/fa'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      {/* Page content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row justify-center items-center gap-2">
        <span className="flex items-center gap-1">
          Made by <span className="font-semibold text-gray-800 dark:text-white">Saumya Shah</span>
        </span>

        <span className="hidden sm:inline">|</span>

        <a
          href="https://github.com/saumyashah0510"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <FaGithub /> GitHub
        </a>

        <span className="hidden sm:inline">|</span>

        <a
          href="https://instagram.com/saumyashah05"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-pink-500 hover:underline"
        >
          <FaInstagram /> Instagram
        </a>
      </footer>
    </div>
  )
}
