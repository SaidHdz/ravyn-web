import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '@/views/Landing'
import KlinoPage from '@/views/Klino'
import { AuthProvider } from '@/hooks/useAuth'
import { LanguageProvider } from '@/context/LanguageContext'
import '@@/global.css'
import './tailwind.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/klino" element={<KlinoPage />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>,
)
