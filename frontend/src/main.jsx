import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router'
import DetailNote from './components/DetailNote'
import ProfilePage from './components/ProfilePage'
import Login from './components/Login'
import Layout from './components/Layout'
import Register from './components/Register'
import { GuestRoute, ProtectedRoute } from './components/AuthGuard'
import CreateNote from './components/CreateNote'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<App />} />
            <Route path="/:id" element={<DetailNote />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/createnote" element={<CreateNote />} />
            <Route path="/edit/:id" element={<CreateNote />} />
          </Route>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
