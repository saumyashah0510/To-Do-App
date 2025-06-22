import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import {
  FaMoon, FaSun, FaSignOutAlt, FaTrash, FaCheckCircle, 
  FaUndo, FaTimes, FaEdit, FaPlus, FaFilter
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [error, setError] = useState('')
  const [newTodo, setNewTodo] = useState({ title: '', description: '', due_date: '' })
  const [editId, setEditId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
    fetchTodos()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const fetchTodos = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get('/todos/')
      setTodos(res.data)
    } catch (err) {
      setError('Failed to fetch todos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editId) {
        await axios.put(`/todos/${editId}`, newTodo)
      } else {
        await axios.post('/todos/', newTodo)
      }
      setNewTodo({ title: '', description: '', due_date: '' })
      setEditId(null)
      await fetchTodos()
    } catch (err) {
      setError(`Failed to ${editId ? 'update' : 'add'} todo: ${err.response?.data?.message || ''}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return
    setIsLoading(true)
    try {
      await axios.delete(`/todos/${id}`)
      await fetchTodos()
    } catch (err) {
      setError('Failed to delete todo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleComplete = async (todo) => {
    setIsLoading(true)
    try {
      await axios.put(`/todos/${todo.id}`, { completed: !todo.completed })
      await fetchTodos()
    } catch (err) {
      setError('Failed to update todo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleEdit = (todo) => {
    setEditId(todo.id)
    setNewTodo({
      title: todo.title,
      description: todo.description || '',
      due_date: todo.due_date ? todo.due_date.slice(0, 10) : ''
    })
    document.getElementById('todo-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditId(null)
    setNewTodo({ title: '', description: '', due_date: '' })
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'incomplete') return !todo.completed
    return true
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (a.due_date && b.due_date) return new Date(a.due_date) - new Date(b.due_date)
    return 0
  })

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen overflow-x-hidden transition-colors duration-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#0f172a] dark:to-[#1e293b] px-4 py-6 md:py-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Todo App</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-yellow-300 shadow hover:scale-105 transition"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition flex items-center gap-1"
            >
              <FaSignOutAlt size={12} />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto space-y-6">
          {/* Filter Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1">
                <FaFilter size={12} /> Filter Tasks
              </h2>
              <div className="flex gap-1">
                {['all', 'incomplete', 'completed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all 
                      ${filter === f
                        ? 'bg-blue-600 text-white shadow-inner'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Add/Update Form */}
          <section id="todo-form" className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                {editId ? 'Edit Task' : 'Add New Task'}
              </h2>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="title" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input 
                    id="title"
                    type="text" 
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    required
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input 
                    id="description"
                    type="text" 
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="due_date" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input 
                    id="due_date"
                    type="date" 
                    value={newTodo.due_date}
                    onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-3 pt-1">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition font-medium shadow text-sm ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <FaPlus size={10} />
                      {editId ? 'Update Task' : 'Add Task'}
                    </>
                  )}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition flex items-center gap-1 text-sm"
                  >
                    <FaTimes size={10} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-3 rounded-lg text-sm"
              >
                <p className="font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Todo List */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-1">
              Your Tasks
              {isLoading && (
                <span className="inline-block h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              )}
            </h2>
            
            {sortedTodos.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {filter === 'all' 
                  ? "You don't have any tasks yet."
                  : filter === 'completed' 
                    ? "No completed tasks yet."
                    : "All tasks completed!"}
              </div>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence>
                  {sortedTodos.map((todo) => (
                    <motion.li
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      layout
                      className={`group relative overflow-hidden rounded-lg border-l-4 shadow-sm transition-all
                        ${todo.completed
                          ? 'border-green-500 bg-white/70 dark:bg-gray-800/70'
                          : 'border-blue-500 bg-white dark:bg-gray-800'}`}
                    >
                      <div className="p-4 flex justify-between items-start gap-3">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => handleToggleComplete(todo)}
                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                              todo.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 dark:border-gray-500 hover:border-blue-500'
                            }`}
                            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {todo.completed && <FaCheckCircle size={10} />}
                          </button>
                          <div className="min-w-0">
                            <h3 className={`text-base font-medium break-words ${
                              todo.completed
                                ? 'line-through text-gray-500 dark:text-gray-400'
                                : 'text-gray-800 dark:text-white'
                            }`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className={`text-xs mt-1 break-words ${
                                todo.completed
                                  ? 'text-gray-400 dark:text-gray-500'
                                  : 'text-gray-600 dark:text-gray-300'
                              }`}>
                                {todo.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-1">
                              {todo.due_date && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  new Date(todo.due_date) < new Date() && !todo.completed
                                    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                }`}>
                                  Due: {new Date(todo.due_date).toLocaleDateString()}
                                </span>
                              )}
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                todo.completed
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                              }`}>
                                {todo.completed ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(todo)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                            title="Delete"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}