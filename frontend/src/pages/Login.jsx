import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa'

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const params = new URLSearchParams()
      params.append('username', formData.username)
      params.append('password', formData.password)

      const res = await axios.post('/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      localStorage.setItem('token', res.data.access_token)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Invalid credentials')
    }
  }

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex transition-all duration-700 bg-light-gradient dark:bg-dark-gradient">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/30 dark:bg-black/30 text-black dark:text-white shadow-lg backdrop-blur-md hover:scale-105 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10">
          <h1 className="text-4xl font-bold drop-shadow-md text-gray-800 dark:text-white">
            Welcome Back!
          </h1>
          <p className="mt-4 text-lg text-center max-w-sm text-gray-700 dark:text-gray-300">
            Organize your tasks beautifully. Let’s log you in.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-5"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white drop-shadow">
              Login
            </h2>

            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-transparent dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-300"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-transparent dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-300"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white py-2 rounded-lg transition font-semibold"
            >
              Login
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center font-semibold">
                {error}
              </p>
            )}

            <p className="text-sm text-center text-gray-700 dark:text-gray-300">
              Don’t have an account?{' '}
              <a
                href="/register"
                className="text-blue-600 dark:text-purple-300 hover:underline font-semibold"
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
