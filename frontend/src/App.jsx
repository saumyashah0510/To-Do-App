import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import TodoList from './pages/TodoList'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
