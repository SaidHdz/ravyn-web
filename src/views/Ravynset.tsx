import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RavynsetHero from '@/components/sections/RavynsetHero'
import RavynsetProblema from '@/components/sections/RavynsetProblema'
import RavynsetIncluye from '@/components/sections/RavynsetIncluye'
import RavynsetPlanes from '@/components/sections/RavynsetPlanes'
import RavynsetProceso from '@/components/sections/RavynsetProceso'
import RavynsetFAQ from '@/components/sections/RavynsetFAQ'

export default function RavynsetPage() {
  useEffect(() => {
    document.title = 'Ravynset — Ravyn Labs'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-[64px]" style={{ overflowX: 'hidden' }}>
        <RavynsetHero />
        <RavynsetProblema />
        <RavynsetIncluye />
        <RavynsetPlanes />
        <RavynsetProceso />
        <RavynsetFAQ />
      </main>
      <Footer />
    </>
  )
}
