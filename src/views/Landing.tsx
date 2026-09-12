import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '@/context/LanguageContext'
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
  const { language } = useLanguage()

  const seo = language === 'es'
    ? {
        title: 'Ravyn — De la semilla al producto | Estudio de Software en México',
        description: 'Estudio y laboratorio de software en México. Construimos sistemas web, apps de gestión y automatizaciones a la medida para negocios. Desde la idea hasta el producto funcionando.',
        ogTitle: 'Ravyn — De la semilla al producto.',
        ogDesc: 'Construimos sistemas web, apps y automatizaciones a la medida para negocios en México.',
      }
    : {
        title: 'Ravyn — From Seed to Product | Software Studio in Mexico',
        description: 'Software studio and product lab in Mexico. We build custom web systems, management apps, and automations for businesses. From idea to running product.',
        ogTitle: 'Ravyn — From seed to product.',
        ogDesc: 'We build custom web systems, apps, and automations for businesses in Mexico.',
      }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href="https://ravynstudio.mx/" />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDesc} />
        <meta property="og:url" content="https://ravynstudio.mx/" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDesc} />
        <html lang={language} />
      </Helmet>

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
