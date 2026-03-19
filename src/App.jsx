import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import LinearAlgebraPage from './pages/dashboard/LinearAlgebraPage.jsx'
import CalculusPage from './pages/dashboard/CalculusPage.jsx'
import StatisticsPage from './pages/dashboard/StatisticsPage.jsx'
import ImageParserPage from './pages/dashboard/ImageParserPage.jsx'
import HistoryPage from './pages/dashboard/HistoryPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard/*"
            element={
              <AppLayout>
                <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route path="linear-algebra" element={<LinearAlgebraPage />} />
                  <Route path="calculus" element={<CalculusPage />} />
                  <Route path="statistics" element={<StatisticsPage />} />
                  <Route path="image" element={<ImageParserPage />} />
                  <Route path="history" element={<HistoryPage />} />
                </Routes>
              </AppLayout>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
