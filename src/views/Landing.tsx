import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/sections/Hero'
import Manifiesto from '@/components/sections/Manifiesto'
import Arquitectura from '@/components/sections/Arquitectura'
import Servicios from '@/components/sections/Servicios'
import Proyectos from '@/components/sections/Proyectos'
import Proceso from '@/components/sections/Proceso'
import Contacto from '@/components/sections/Contacto'

export default function Landing() {
  useEffect(() => {
    document.title = 'Ravyn — De la semilla al producto.'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-[64px]">
        <Hero />
        <Manifiesto />
        <Arquitectura />
        <Servicios />
        <Proyectos />
        <Proceso />
        <Contacto />
      </main>

      <Footer />
    </>
  )
}
