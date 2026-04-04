import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '@/App.tsx'
import Landing from '@/views/Landing.tsx'
import ModuleViewer from '@/views/ModuleViewer.tsx'
import Configurator from '@/views/Configurator.tsx'
import SuccessPage from '@/views/SuccessPage.tsx'
import Viewer from '@/views/Viewer.tsx'
import '@@/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 1. Rutas Estáticas (Prioridad Máxima) */}
        <Route path="/" element={<Landing />} />
        <Route path="/configurator" element={<Configurator />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/experience/:id" element={<App />} />
        <Route path="/preview" element={<App />} />
        <Route path="/debug/:moduleType" element={<ModuleViewer />} />
        <Route path="/debug/:theme/:moduleType" element={<ModuleViewer />} />

        {/* 2. Ruta Dinámica por Slug (Fallback / Última opción) */}
        <Route path="/:slug" element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
