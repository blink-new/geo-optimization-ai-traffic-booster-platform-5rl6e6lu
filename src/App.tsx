import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './components/LandingPage'
import SiteAnalysisReport from './components/SiteAnalysisReport'
import AdminDashboard from './components/AdminDashboard'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('landing')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // Check URL parameters to determine view
    const urlParams = new URLSearchParams(window.location.search)
    const analysisToken = Array.from(urlParams.keys()).find(key => key.startsWith('test'))
    
    if (analysisToken && urlParams.get(analysisToken)) {
      setCurrentView('analysis')
    } else if (window.location.pathname.includes('/admin')) {
      setCurrentView('admin')
    } else {
      setCurrentView('landing')
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Optimization Platform...</p>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'analysis':
        return <SiteAnalysisReport />
      case 'admin':
        return user ? <AdminDashboard /> : <LandingPage />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {renderView()}
      <Toaster />
    </div>
  )
}

export default App