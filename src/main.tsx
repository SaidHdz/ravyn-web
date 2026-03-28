import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '@/App.tsx'
import Landing from '@/views/Landing.tsx'
import ModuleViewer from '@/views/ModuleViewer.tsx'
import Configurator from '@/views/Configurator.tsx'
import '@@/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing Page Principal */}
        <Route path="/" element={<Landing />} />

        {/* Formulario de Configuración (Arquitecto) */}
        <Route path="/configurator" element={<Configurator />} />

        {/* Página para ver un pedido específico */}

        <Route path="/experience/:id" element={<App />} />
        
        {/* Página de previsualización para el modal de packs */}
        <Route path="/preview" element={<App />} />
        
        {/* Rutas de debug para módulos aislados */}
        <Route path="/debug/:moduleType" element={<ModuleViewer />} />
        <Route path="/debug/:theme/:moduleType" element={<ModuleViewer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
