import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import KlinoHero from '@/components/sections/KlinoHero'
import KlinoProblema from '@/components/sections/KlinoProblema'
import KlinoIncluye from '@/components/sections/KlinoIncluye'
import KlinoProceso from '@/components/sections/KlinoProceso'
import KlinoPlanes from '@/components/sections/KlinoPlanes'
import KlinoFAQ from '@/components/sections/KlinoFAQ'

export default function KlinoPage() {
  useEffect(() => {
    document.title = 'Klino — Nota clínica por voz · Ravyn Labs'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-[64px]" style={{ overflowX: 'hidden' }}>
        <KlinoHero />
        <KlinoProblema />
        <KlinoIncluye />
        <KlinoProceso />
        <KlinoPlanes />
        <KlinoFAQ />
      </main>
      <Footer />
    </>
  )
}
