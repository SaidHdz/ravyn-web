import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import KlinoHero from '@/components/sections/KlinoHero'
import KlinoProblema from '@/components/sections/KlinoProblema'
import KlinoIncluye from '@/components/sections/KlinoIncluye'
import KlinoProceso from '@/components/sections/KlinoProceso'
import KlinoPlanes from '@/components/sections/KlinoPlanes'
import KlinoFAQ from '@/components/sections/KlinoFAQ'

export default function KlinoPage() {
  const { t, language } = useLanguage()

  const seo = language === 'es'
    ? {
        title: 'Klino — Documentación clínica por voz | Notas médicas automáticas · Ravyn Labs',
        description: 'App que transcribe la consulta médica por voz y genera la nota clínica automática conforme a NOM-004 y NOM-024. Sin teclear, sin dejar de mirar al paciente. Beta abierto.',
        ogTitle: 'Klino — Habla con tu paciente. Klino escribe la nota.',
        ogDesc: 'Documentación clínica por voz. Nota médica automática conforme a NOM-004 y NOM-024. Disponible en beta.',
      }
    : {
        title: 'Klino — Voice-Powered Clinical Notes | Automatic Medical Documentation · Ravyn Labs',
        description: 'App that transcribes medical consultations by voice and generates structured clinical notes compliant with medical standards. No typing needed. Open beta.',
        ogTitle: 'Klino — Talk to your patient. Klino writes the note.',
        ogDesc: 'Voice-powered clinical documentation. Automatic medical notes compliant with standards. Available in beta.',
      }

  // JSON-LD para FAQPage de Klino (rich snippets en Google)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': t.klino.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.pregunta,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.respuesta,
      },
    })),
  }

  // JSON-LD para SoftwareApplication
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Klino',
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'iOS, Android',
    'description': seo.description,
    'url': 'https://ravynstudio.mx/klino',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'MXN',
      'description': language === 'es' ? 'Gratis durante el beta' : 'Free during beta',
    },
    'author': {
      '@type': 'Organization',
      'name': 'Ravyn Labs',
      'url': 'https://ravynstudio.mx',
    },
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href="https://ravynstudio.mx/klino" />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDesc} />
        <meta property="og:url" content="https://ravynstudio.mx/klino" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDesc} />
        <html lang={language} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
      </Helmet>

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
