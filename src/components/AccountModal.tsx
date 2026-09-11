import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  User,
  FolderGit2,
  Clock,
  ExternalLink,
  LogOut,
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw,
  Layers,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Pencil,
  Check,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { translateAuthError } from '@/lib/authErrors'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
}

type ProjectTab = 'all' | 'in_progress' | 'completed'

interface Milestone {
  name: string
  done: boolean
}

interface ClientProject {
  id: string
  title: string
  category: string
  status: 'in_progress' | 'completed' | 'planning'
  phase: string
  progress: number
  targetDate?: string
  completedDate?: string
  liveUrl?: string
  stagingUrl?: string
  milestones: Milestone[]
}

const formatProjectDate = (dateStr?: string, lang: 'es' | 'en' = 'es') => {
  if (!dateStr) return ''
  const monthMap: Record<string, { es: string; en: string }> = {
    enero: { es: 'Enero', en: 'January' },
    febrero: { es: 'Febrero', en: 'February' },
    marzo: { es: 'Marzo', en: 'March' },
    abril: { es: 'Abril', en: 'April' },
    mayo: { es: 'Mayo', en: 'May' },
    junio: { es: 'Junio', en: 'June' },
    julio: { es: 'Julio', en: 'July' },
    agosto: { es: 'Agosto', en: 'August' },
    septiembre: { es: 'Septiembre', en: 'September' },
    octubre: { es: 'Octubre', en: 'October' },
    noviembre: { es: 'Noviembre', en: 'November' },
    diciembre: { es: 'Diciembre', en: 'December' },
    january: { es: 'Enero', en: 'January' },
    february: { es: 'Febrero', en: 'February' },
    march: { es: 'Marzo', en: 'March' },
    april: { es: 'Abril', en: 'April' },
    may: { es: 'Mayo', en: 'May' },
    june: { es: 'Junio', en: 'June' },
    july: { es: 'Julio', en: 'July' },
    august: { es: 'Agosto', en: 'August' },
    september: { es: 'Septiembre', en: 'September' },
    october: { es: 'Octubre', en: 'October' },
    november: { es: 'Noviembre', en: 'November' },
    december: { es: 'Diciembre', en: 'December' },
  }

  let translated = dateStr
  for (const [key, val] of Object.entries(monthMap)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi')
    if (regex.test(dateStr)) {
      translated = dateStr.replace(regex, val[lang])
      break
    }
  }
  return translated
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { user, signOut } = useAuth()
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<ProjectTab>('all')
  const [loadingData, setLoadingData] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [companyInput, setCompanyInput] = useState('')
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [companySaveSuccess, setCompanySaveSuccess] = useState(false)
  const [companySaveError, setCompanySaveError] = useState<string | null>(null)
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)

  // Bloqueo de scroll
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`

      return () => {
        const scrollY = document.body.style.top
        document.documentElement.style.overflow = ''
        document.body.style.overflow = originalStyle
        document.body.style.paddingRight = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.top = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isOpen])

  const fetchUserData = async () => {
    if (!user) return
    setLoadingData(true)
    setFetchError(null)

    try {
      // 1. Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (userError && userError.code !== 'PGRST116') {
        console.warn('Error fetching user profile row:', userError)
      }

      setProfile(userData ?? null)

      // 2. Fetch client projects if table exists
      let loadedProjects: ClientProject[] = []
      try {
        const { data: projectsData, error: projError } = await supabase
          .from('client_projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!projError && projectsData && projectsData.length > 0) {
          loadedProjects = projectsData.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category || t.accountModal.sampleProjectCategory,
            status: p.status || 'in_progress',
            phase: p.phase || t.accountModal.samplePhaseName,
            progress: p.progress ?? 70,
            targetDate: p.target_date || 'Junio 2026',
            completedDate: p.completed_date,
            liveUrl: p.live_url,
            stagingUrl: p.staging_url,
            milestones: p.milestones || [
              { name: t.accountModal.sampleMilestone1, done: true },
              { name: t.accountModal.sampleMilestone2, done: true },
              { name: t.accountModal.sampleMilestone3, done: true },
              { name: t.accountModal.sampleMilestone4, done: false },
            ],
          }))
        }
      } catch {
        // client_projects table may not exist yet in db
      }

      // Si la cuenta es de pruebas (saiddino01@gmail), inyectamos 4 proyectos para validar el sistema de carpetas
      const isSaiddino = user.email?.toLowerCase().includes('saiddino01')
      const isEn = language === 'en'

      if (isSaiddino) {
        loadedProjects = [
          {
            id: 'proj-demo-1',
            title: isEn ? 'Web Platform & Management System' : 'Plataforma Web & Sistema de Gestión',
            category: isEn ? 'Web Development & Integrations' : 'Desarrollo Web & Integraciones',
            status: 'in_progress',
            phase: isEn ? '03 Frontend & API Construction' : '03 Construcción Frontend & API',
            progress: 72,
            targetDate: isEn ? 'July 2026' : 'Julio 2026',
            stagingUrl: 'https://staging.ravyn.mx/preview',
            milestones: [
              {
                name: isEn
                  ? '01 Seed — Scope and architecture defined'
                  : '01 Semilla — Alcance y arquitectura definidos',
                done: true,
              },
              {
                name: isEn
                  ? '02 UI/UX Design and interactive prototyping'
                  : '02 Diseño UI/UX y prototipado interactivo',
                done: true,
              },
              {
                name: isEn
                  ? '03 Frontend & Backend construction with APIs'
                  : '03 Construcción frontend y backend con APIs',
                done: true,
              },
              {
                name: isEn
                  ? '04 QA, stress testing and final deployment'
                  : '04 QA, pruebas de estrés y despliegue final',
                done: false,
              },
            ],
          },
          {
            id: 'proj-demo-2',
            title: isEn ? 'Slimergy App — Expo Port & Functional Redesign' : 'Slimergy App — Porteo a Expo & Rediseño Funcional',
            category: isEn ? 'Expo & Functional Redesign' : 'Porteo a Expo & Rediseño Funcional',
            status: 'completed',
            phase: isEn ? 'Functional App Delivered' : 'App Funcional Entregada',
            progress: 100,
            completedDate: isEn ? 'May 2026' : 'Mayo 2026',
            liveUrl: 'https://slimergy.app',
            milestones: [
              {
                name: isEn
                  ? '01 Full codebase porting to Expo (React Native) per client request'
                  : '01 Porteo completo del código a Expo (React Native) por petición del cliente',
                done: true,
              },
              {
                name: isEn
                  ? '02 Direct code-level UI/UX redesign (No Figma, built live in Expo)'
                  : '02 Rediseño UI/UX directamente en código (Sin Figma, construido en Expo)',
                done: true,
              },
              {
                name: isEn
                  ? '03 Functional rebuild of Home, Rooms breakdown & Alert Settings'
                  : '03 Reconstrucción funcional de Home, Cuartos y Ajustes de alertas',
                done: true,
              },
              {
                name: isEn
                  ? '04 Integration testing with Slimergy V3 hardware & final production delivery'
                  : '04 Pruebas de integración con hardware Slimergy V3 y entrega final en producción',
                done: true,
              },
            ],
          },
          {
            id: 'proj-demo-3',
            title: isEn ? 'Automation & WhatsApp CRM' : 'Automatización & WhatsApp CRM',
            category: isEn ? 'Automation & n8n' : 'Automatización & n8n',
            status: 'in_progress',
            phase: isEn ? '02 Flow Integrations & Webhooks' : '02 Integración de Flujos & Webhooks',
            progress: 48,
            targetDate: isEn ? 'August 2026' : 'Agosto 2026',
            stagingUrl: 'https://staging.ravyn.mx/crm-demo',
            milestones: [
              {
                name: isEn
                  ? '01 Sales funnel & commercial triggers definition'
                  : '01 Definición del embudo comercial y triggers',
                done: true,
              },
              {
                name: isEn
                  ? '02 Connection with WhatsApp Business API'
                  : '02 Conexión con WhatsApp Business API',
                done: true,
              },
              {
                name: isEn
                  ? '03 Automated calendar appointment synchronization'
                  : '03 Sincronización automática de citas en calendar',
                done: false,
              },
              {
                name: isEn
                  ? '04 Team onboarding and live pipeline monitoring'
                  : '04 Capacitación de equipo y monitoreo en vivo',
                done: false,
              },
            ],
          },
          {
            id: 'proj-demo-4',
            title: isEn ? 'Digital Identity & Brand Landing' : 'Identidad Digital & Landing de Marca',
            category: isEn ? 'Branding & Frontend' : 'Branding & Frontend',
            status: 'completed',
            phase: isEn ? 'Successful Launch' : 'Lanzamiento Exitoso',
            progress: 100,
            completedDate: isEn ? 'April 2026' : 'Abril 2026',
            liveUrl: 'https://ravyn.mx',
            milestones: [
              {
                name: isEn
                  ? '01 Editorial concept and botanical palette'
                  : '01 Concepto editorial y paleta botánica',
                done: true,
              },
              {
                name: isEn
                  ? '02 High-fidelity wireframing and prototyping'
                  : '02 Prototipado en alta fidelidad',
                done: true,
              },
              {
                name: isEn
                  ? '03 Responsive web development & micro-interactions'
                  : '03 Desarrollo web responsive y microinteracciones',
                done: true,
              },
              {
                name: isEn
                  ? '04 Production deployment and SEO optimization'
                  : '04 Puesta en producción y optimización SEO',
                done: true,
              },
            ],
          },
        ]
      } else if (loadedProjects.length === 0) {
        // Si no hay proyectos en la tabla pero el usuario tiene metadatos de proyecto o negocio,
        // creamos el proyecto en curso del cliente
        const companyOrProjectName =
          user.user_metadata?.company_name ||
          user.user_metadata?.clinic_name ||
          userData?.company_name

        if (companyOrProjectName) {
          loadedProjects = [
            {
              id: 'proj-active-1',
              title: companyOrProjectName,
              category: t.accountModal.sampleProjectCategory,
              status: 'in_progress',
              phase: t.accountModal.samplePhaseName,
              progress: 75,
              targetDate: isEn ? 'July 2026' : 'Julio 2026',
              stagingUrl: 'https://staging.ravyn.mx/preview',
              milestones: [
                { name: t.accountModal.sampleMilestone1, done: true },
                { name: t.accountModal.sampleMilestone2, done: true },
                { name: t.accountModal.sampleMilestone3, done: true },
                { name: t.accountModal.sampleMilestone4, done: false },
              ],
            },
          ]
        }
      }

      setProjects(loadedProjects)
      if (loadedProjects.length > 0) {
        setExpandedProjectId((prev) => prev ?? loadedProjects[0].id)
      }
    } catch (err) {
      console.error('Error fetching account data:', err)
      setFetchError(translateAuthError(err))
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (isOpen && user) fetchUserData()
  }, [isOpen, user, language])

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const handleStartEditCompany = () => {
    const currentName =
      profile?.company_name ||
      user?.user_metadata?.company_name ||
      user?.user_metadata?.clinic_name ||
      ''
    setCompanyInput(currentName)
    setCompanySaveError(null)
    setIsEditingCompany(true)
  }

  const handleSaveCompany = async () => {
    const trimmed = companyInput.trim()
    if (!trimmed || !user) return
    setIsSavingCompany(true)
    setCompanySaveError(null)

    try {
      // 1. Update Supabase Auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          company_name: trimmed,
          clinic_name: trimmed,
        },
      })
      if (authError) throw authError

      // 2. Update public.users table if it exists
      try {
        await supabase
          .from('users')
          .update({ company_name: trimmed, updated_at: new Date().toISOString() })
          .eq('id', user.id)
      } catch {
        // non-fatal
      }

      // 3. Update local state
      setProfile((prev: any) => ({ ...(prev || {}), company_name: trimmed }))
      setProjects((prev) =>
        prev.map((p) => (p.id === 'proj-active-1' ? { ...p, title: trimmed } : p))
      )

      setCompanySaveSuccess(true)
      setIsEditingCompany(false)
      setTimeout(() => setCompanySaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating company name:', err)
      setCompanySaveError(translateAuthError(err))
    } finally {
      setIsSavingCompany(false)
    }
  }

  const handleOpenContact = () => {
    onClose()
    const contactSection = document.getElementById('contacto')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const displayData = {
    contactName:
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      t.accountModal.defaultUser,
    email: user?.email || '',
    company:
      profile?.company_name ||
      user?.user_metadata?.company_name ||
      user?.user_metadata?.clinic_name ||
      t.accountModal.noCompany,
    phone:
      profile?.phone ||
      user?.user_metadata?.clinic_phone ||
      user?.user_metadata?.phone ||
      t.accountModal.notRegistered,
    memberDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
          year: 'numeric',
          month: 'short',
        })
      : '2026',
  }

  // Filtrado de proyectos
  const filteredProjects = projects.filter((p) => {
    if (activeTab === 'in_progress') return p.status === 'in_progress' || p.status === 'planning'
    if (activeTab === 'completed') return p.status === 'completed'
    return true
  })

  // Obtener iniciales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="account-modal-overlay">
          <motion.div
            className="account-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="account-modal-container"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          >
            {/* Header */}
            <div className="account-modal-header">
              <div className="header-brand-info">
                <div className="avatar-chip">{getInitials(displayData.contactName)}</div>
                <div>
                  <h2 className="account-modal-title">{displayData.contactName}</h2>
                  <p className="account-modal-sub">{displayData.email}</p>
                </div>
              </div>
              <button
                className="account-modal-close"
                onClick={onClose}
                type="button"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="account-modal-content">
              {loadingData ? (
                <div className="loading-state">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="loading-text">{t.accountModal.syncing}</p>
                </div>
              ) : fetchError ? (
                <div className="error-state">
                  <AlertCircle className="w-10 h-10 text-amber-600" />
                  <div>
                    <h3 className="error-title">{t.accountModal.loadError}</h3>
                    <p className="error-desc">{fetchError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchUserData}
                    className="btn-retry"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t.accountModal.retry}
                  </button>
                </div>
              ) : (
                <div className="account-portal-layout">
                  {/* Columna Izquierda: Perfil y Soporte */}
                  <div className="account-sidebar">
                    {/* Tarjeta Perfil */}
                    <div className="portal-card profile-card">
                      <div className="card-header-bar">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-pine" />
                          <h3 className="card-heading">{t.accountModal.profileTitle}</h3>
                        </div>
                      </div>

                      <div className="profile-fields-list">
                        <div className="field-group">
                          <span className="field-label flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 opacity-60" />
                            {t.accountModal.companyLabel}
                          </span>

                          {isEditingCompany ? (
                            <div className="company-edit-box">
                              <input
                                type="text"
                                className="company-input-field"
                                value={companyInput}
                                onChange={(e) => setCompanyInput(e.target.value)}
                                placeholder={t.accountModal.companyPlaceholder}
                                autoFocus
                                disabled={isSavingCompany}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveCompany()
                                  if (e.key === 'Escape') {
                                    setIsEditingCompany(false)
                                    setCompanySaveError(null)
                                  }
                                }}
                              />
                              <div className="company-btn-group">
                                <button
                                  type="button"
                                  className="btn-company-cancel"
                                  onClick={() => {
                                    setIsEditingCompany(false)
                                    setCompanySaveError(null)
                                  }}
                                  disabled={isSavingCompany}
                                  title={t.accountModal.cancel}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>{t.accountModal.cancel}</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn-company-save"
                                  onClick={handleSaveCompany}
                                  disabled={isSavingCompany || !companyInput.trim()}
                                  title={t.accountModal.save}
                                >
                                  {isSavingCompany ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5" />
                                  )}
                                  <span>{isSavingCompany ? t.accountModal.saving : t.accountModal.save}</span>
                                </button>
                              </div>
                              {companySaveError && (
                                <p className="company-edit-error">{companySaveError}</p>
                              )}
                            </div>
                          ) : (
                            <div className="field-value-row">
                              <strong className="field-value truncate">{displayData.company}</strong>
                              <button
                                type="button"
                                onClick={handleStartEditCompany}
                                className="btn-pencil-right"
                                title={t.accountModal.editCompany}
                                aria-label={t.accountModal.editCompany}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              {companySaveSuccess && (
                                <span className="save-success-tag">
                                  <Check className="w-3 h-3" /> {t.accountModal.companyUpdated}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="field-group">
                          <span className="field-label flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 opacity-60" />
                            {t.accountModal.emailLabel}
                          </span>
                          <p className="field-value font-mono text-[0.88rem] break-all">{displayData.email}</p>
                        </div>

                        <div className="field-group">
                          <span className="field-label flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 opacity-60" />
                            {t.accountModal.phoneLabel}
                          </span>
                          <p className="field-value font-mono text-[0.88rem]">{displayData.phone}</p>
                        </div>

                        <div className="field-group">
                          <span className="field-label flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-60" />
                            {t.accountModal.memberSince}
                          </span>
                          <p className="field-value capitalize">{displayData.memberDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta Equipo de Desarrollo */}
                    <div className="portal-card support-card">
                      <div className="card-header-bar">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-radish" />
                          <h3 className="card-heading">{t.accountModal.supportTitle}</h3>
                        </div>
                      </div>

                      <p className="support-desc">{t.accountModal.supportDesc}</p>

                      <a
                        href={`https://wa.me/528361168007?text=${encodeURIComponent(
                          language === 'es'
                            ? `Hola equipo de Ravyn, soy ${displayData.contactName} (${displayData.email}) y quiero consultar sobre el estado de mi proyecto.`
                            : `Hello Ravyn team, this is ${displayData.contactName} (${displayData.email}) checking in about my project status.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-talk-team"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {t.accountModal.talkToTeam}
                      </a>
                    </div>

                    {/* Cerrar Sesión */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="btn-signout"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.accountModal.signOut}
                    </button>
                  </div>

                  {/* Columna Derecha: Seguimiento de Proyectos */}
                  <div className="account-main-area">
                    <div className="projects-top-bar">
                      <div>
                        <h3 className="projects-main-title flex items-center gap-2.5">
                          <FolderGit2 className="w-6 h-6 text-pine" />
                          {t.accountModal.projectsTitle}
                        </h3>
                        <p className="projects-main-sub">{t.accountModal.projectsSubtitle}</p>
                      </div>

                      {/* Tabs de estado */}
                      <div className="projects-tabs">
                        <button
                          type="button"
                          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                          onClick={() => setActiveTab('all')}
                        >
                          {t.accountModal.tabAll}
                          <span className="tab-count">{projects.length}</span>
                        </button>
                        <button
                          type="button"
                          className={`tab-btn ${activeTab === 'in_progress' ? 'active' : ''}`}
                          onClick={() => setActiveTab('in_progress')}
                        >
                          {t.accountModal.tabInProgress}
                          <span className="tab-count">
                            {projects.filter((p) => p.status === 'in_progress' || p.status === 'planning').length}
                          </span>
                        </button>
                        <button
                          type="button"
                          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                          onClick={() => setActiveTab('completed')}
                        >
                          {t.accountModal.tabCompleted}
                          <span className="tab-count">
                            {projects.filter((p) => p.status === 'completed').length}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Listado de proyectos */}
                    {filteredProjects.length === 0 ? (
                      <div className="empty-projects-state">
                        <div className="empty-icon-wrap">
                          <Layers className="w-8 h-8 text-pine/60" />
                        </div>
                        <h4 className="empty-title">{t.accountModal.emptyTitle}</h4>
                        <p className="empty-desc">{t.accountModal.emptyDesc}</p>
                        <button
                          type="button"
                          onClick={handleOpenContact}
                          className="btn-plant-project"
                        >
                          {t.accountModal.plantProjectCta}
                        </button>
                      </div>
                    ) : (
                      <div className="folders-stack">
                        {filteredProjects.map((project, index) => {
                          const isInProgress = project.status === 'in_progress' || project.status === 'planning'
                          const isExpanded = expandedProjectId === project.id

                          return (
                            <div
                              key={project.id}
                              className={`folder-item ${isExpanded ? 'is-expanded' : 'is-collapsed'} ${
                                isInProgress ? 'is-in-progress' : 'is-completed'
                              }`}
                              style={{ zIndex: isExpanded ? 50 : 10 + index }}
                            >
                              {/* Lengüeta de la carpeta (Folder Tab) */}
                              <div
                                className="folder-tab"
                                onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                              >
                                <span className={`folder-tab-badge ${isInProgress ? 'badge-progress' : 'badge-completed'}`}>
                                  {isInProgress ? (
                                    <span className="tab-loading-bar-track">
                                      <span
                                        className="tab-loading-bar-fill"
                                        style={{ width: `${project.progress}%` }}
                                      />
                                    </span>
                                  ) : (
                                    <span className="tab-completed-ring">
                                      <Check className="w-3.5 h-3.5" strokeWidth={2.6} />
                                    </span>
                                  )}
                                  <span>{isInProgress ? t.accountModal.statusInProgress : t.accountModal.statusCompleted}</span>
                                </span>
                                <span className="folder-tab-code">EXP-0{index + 1}</span>
                              </div>

                              {/* Cuerpo de la carpeta */}
                              <div className="folder-body">
                                {/* Header de la carpeta (clickeable para expandir/plegar) */}
                                <div
                                  className="folder-header"
                                  onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                                >
                                  <div className="folder-title-wrap">
                                    <span className="folder-category">{project.category}</span>
                                    <h4 className="folder-title">{project.title}</h4>
                                  </div>

                                  <div className="folder-header-right">
                                    {!isExpanded && (
                                      <div className="folder-mini-progress">
                                        <span className="mini-phase-text">{project.phase}</span>
                                        {isInProgress ? (
                                          <div className="folder-mini-bar-track" title={project.phase}>
                                            <div
                                              className="folder-mini-bar-fill"
                                              style={{ width: `${project.progress}%` }}
                                            />
                                          </div>
                                        ) : (
                                          <span className="mini-status-done flex items-center gap-1 font-mono">
                                            <Check className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                                            {t.accountModal.statusCompleted}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      className={`folder-toggle-btn ${isExpanded ? 'open' : ''}`}
                                      aria-label={isExpanded ? 'Contraer expediente' : 'Abrir expediente'}
                                    >
                                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                                    </button>
                                  </div>
                                </div>

                                {/* Contenido expandido de la carpeta */}
                                <AnimatePresence initial={false}>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                      className="folder-expanded-content"
                                    >
                                      {/* Barra de progreso y Fase */}
                                      <div className="project-progress-box">
                                        <div className="progress-info-row">
                                          <span className="phase-label">
                                            <Clock className="w-3.5 h-3.5 text-pine/70 inline mr-1" />
                                            {t.accountModal.currentPhase}: <strong>{project.phase}</strong>
                                          </span>
                                        </div>

                                        <div className="progress-track">
                                          <div
                                            className="progress-fill"
                                            style={{ width: `${project.progress}%` }}
                                          />
                                        </div>
                                      </div>

                                      {/* Hitos */}
                                      {project.milestones && project.milestones.length > 0 && (
                                        <div className="milestones-section">
                                          <div className="milestones-top-bar">
                                            <h5 className="milestones-heading flex items-center gap-1.5">
                                              <Sparkles className="w-3.5 h-3.5 text-sprout" />
                                              {t.accountModal.milestonesTitle}
                                            </h5>
                                            <span className="milestones-counter font-mono">
                                              {project.milestones.filter((m) => m.done).length} / {project.milestones.length}
                                            </span>
                                          </div>

                                          <div className="milestones-grid">
                                            {project.milestones.map((m, mIdx) => {
                                              const isDone = m.done

                                              return (
                                                <div
                                                  key={mIdx}
                                                  className={`milestone-tile ${isDone ? 'is-done' : 'is-pending'}`}
                                                >
                                                  <div className="milestone-tile-header">
                                                    <span className="milestone-checkbox-wrap">
                                                      {isDone ? (
                                                        <span className="milestone-checkbox is-done">
                                                          <Check className="w-3 h-3 text-white" strokeWidth={2.8} />
                                                        </span>
                                                      ) : (
                                                        <span className="milestone-checkbox is-unconfirmed" />
                                                      )}
                                                    </span>
                                                    <span className="milestone-tag font-mono">
                                                      {isDone
                                                        ? (language === 'es' ? 'Completado' : 'Completed')
                                                        : (language === 'es' ? 'Pendiente' : 'Pending')}
                                                    </span>
                                                  </div>
                                                  <p className="milestone-tile-title">{m.name}</p>
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Footer del card con enlaces y fechas */}
                                      <div className="project-card-footer">
                                        <div className="date-info">
                                          <span className="date-label">
                                            {isInProgress ? t.accountModal.targetDate : t.accountModal.completedDate}
                                          </span>
                                          <strong className="date-value">
                                            {formatProjectDate(
                                              isInProgress ? project.targetDate : project.completedDate,
                                              language
                                            )}
                                          </strong>
                                        </div>

                                        <div className="project-actions">
                                          {project.stagingUrl && (
                                            <a
                                              href={project.stagingUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="btn-project-link staging"
                                            >
                                              {t.accountModal.viewStaging}
                                            </a>
                                          )}
                                          {project.liveUrl && (
                                            <a
                                              href={project.liveUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="btn-project-link live"
                                            >
                                              <span>{t.accountModal.viewLive}</span>
                                              <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <style>{`
            .account-modal-overlay {
              position: fixed;
              inset: 0;
              z-index: 10000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2.5vh 2vw;
              pointer-events: auto;
              overflow: hidden;
            }
            .account-modal-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(16, 52, 42, 0.65);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              z-index: 0;
            }
            .account-modal-container {
              position: relative;
              width: 95vw;
              max-width: 1280px;
              height: 88vh;
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.12);
              border-radius: 28px;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              box-shadow: 0 35px 90px -15px rgba(16, 52, 42, 0.3);
              z-index: 1;
            }
            .account-modal-header {
              padding: 22px 32px;
              border-bottom: 1px solid rgba(16, 52, 42, 0.1);
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #fff;
              flex-shrink: 0;
            }
            .header-brand-info {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .avatar-chip {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: var(--color-pine);
              color: var(--color-cream);
              font-family: var(--font-mono);
              font-size: 0.95rem;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing: 0.05em;
            }
            .account-modal-title {
              font-family: var(--font-display);
              font-size: 1.25rem;
              font-weight: 700;
              color: var(--color-pine);
              line-height: 1.15;
            }
            .account-modal-sub {
              font-family: var(--font-mono);
              font-size: 0.78rem;
              color: var(--text-muted);
              margin-top: 2px;
            }
            .account-modal-close {
              color: var(--text-muted);
              transition: color 0.2s, transform 0.2s;
              cursor: pointer;
              background: transparent;
              border: 1px solid rgba(16, 52, 42, 0.12);
              border-radius: 50%;
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
            }
            .account-modal-close:hover {
              color: var(--color-pine);
              border-color: var(--color-pine);
              transform: scale(1.05);
            }

            .account-modal-content {
              flex: 1;
              overflow-y: auto;
              padding: 32px;
              box-sizing: border-box;
            }

            .loading-state, .error-state {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              gap: 16px;
              text-align: center;
              padding: 40px;
            }
            .loading-text {
              font-family: var(--font-mono);
              font-size: 0.82rem;
              letter-spacing: 0.08em;
              color: var(--text-muted);
              text-transform: uppercase;
            }
            .error-title {
              font-family: var(--font-display);
              font-size: 1.2rem;
              color: var(--color-pine);
              margin-bottom: 6px;
            }
            .error-desc {
              font-size: 0.9rem;
              color: var(--text-secondary);
            }
            .btn-retry {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 10px 20px;
              border-radius: 100vw;
              background: var(--color-pine);
              color: var(--color-cream);
              font-size: 0.85rem;
              font-weight: 600;
              cursor: pointer;
              border: none;
              transition: opacity 0.2s;
            }
            .btn-retry:hover { opacity: 0.9; }

            /* Portal Layout */
            .account-portal-layout {
              display: grid;
              grid-template-columns: 340px 1fr;
              gap: 32px;
              align-items: start;
              max-width: 1200px;
              margin: 0 auto;
            }

            .account-sidebar {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .portal-card {
              background: #fff;
              border: 1px solid rgba(16, 52, 42, 0.12);
              border-radius: 20px;
              padding: 24px;
            }

            .card-header-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 16px;
              margin-bottom: 18px;
              border-bottom: 1px solid rgba(16, 52, 42, 0.08);
            }
            .card-heading {
              font-family: var(--font-mono);
              font-size: 0.76rem;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: var(--color-pine);
            }

            .profile-fields-list {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .field-group {
              display: flex;
              flex-direction: column;
              gap: 3px;
            }
            .field-label-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
            }
            .field-label {
              font-size: 0.72rem;
              font-family: var(--font-mono);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }
            .btn-inline-edit {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background: transparent;
              border: none;
              color: var(--color-pine);
              opacity: 0.65;
              font-family: var(--font-mono);
              font-size: 0.68rem;
              cursor: pointer;
              padding: 2px 6px;
              border-radius: 4px;
              transition: all 0.2s;
            }
            .btn-inline-edit:hover {
              opacity: 1;
              background: rgba(16, 52, 42, 0.06);
            }
            .field-value-row {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .field-value {
              font-size: 0.95rem;
              color: var(--color-pine);
              font-weight: 600;
            }
            .btn-pencil-right {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 26px;
              height: 26px;
              padding: 0;
              border-radius: 7px;
              border: 1px solid rgba(16, 52, 42, 0.15);
              background: rgba(16, 52, 42, 0.04);
              color: var(--color-pine);
              cursor: pointer;
              flex-shrink: 0;
              transition: all 0.2s ease;
            }
            .btn-pencil-right:hover {
              background: var(--color-pine);
              color: var(--color-cream);
              border-color: var(--color-pine);
              transform: translateY(-1px);
            }
            .save-success-tag {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              font-family: var(--font-mono);
              font-size: 0.7rem;
              color: var(--color-sprout);
              font-weight: 600;
            }
            .company-edit-box {
              display: flex;
              flex-direction: column;
              gap: 8px;
              margin-top: 6px;
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.16);
              border-radius: 12px;
              padding: 10px 12px;
              box-shadow: 0 4px 14px rgba(16, 52, 42, 0.04);
              width: 100%;
              box-sizing: border-box;
            }
            .company-input-field {
              width: 100%;
              box-sizing: border-box;
              font-family: var(--font-sans);
              font-size: 0.88rem;
              font-weight: 500;
              color: var(--color-pine);
              background: #ffffff;
              border: 1px solid rgba(16, 52, 42, 0.18);
              border-radius: 8px;
              padding: 7px 10px;
              outline: none;
              transition: border-color 0.2s, box-shadow 0.2s;
            }
            .company-input-field:focus {
              border-color: var(--color-pine);
              box-shadow: 0 0 0 2px rgba(16, 52, 42, 0.08);
            }
            .company-btn-group {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              gap: 8px;
              width: 100%;
            }
            .btn-company-save {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              padding: 6px 14px;
              background: var(--color-pine);
              color: var(--color-cream);
              border: none;
              border-radius: 7px;
              font-size: 0.76rem;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s, transform 0.15s;
            }
            .btn-company-save:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            .btn-company-save:hover:not(:disabled) {
              opacity: 0.92;
              transform: translateY(-1px);
            }
            .btn-company-cancel {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              padding: 5px 10px;
              background: transparent;
              border: 1px solid rgba(16, 52, 42, 0.18);
              color: var(--text-secondary);
              border-radius: 7px;
              font-size: 0.76rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            .btn-company-cancel:hover {
              background: rgba(16, 52, 42, 0.06);
              color: var(--color-pine);
              border-color: var(--color-pine);
            }
            .company-edit-error {
              font-family: var(--font-mono);
              font-size: 0.72rem;
              color: var(--color-radish);
              margin: 0;
            }

            .support-card {
              background: linear-gradient(180deg, rgba(224, 67, 107, 0.04) 0%, rgba(255, 255, 255, 1) 100%);
              border-color: rgba(224, 67, 107, 0.2);
            }
            .team-badge {
              font-family: var(--font-mono);
              font-size: 0.65rem;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              background: rgba(16, 52, 42, 0.08);
              color: var(--color-pine);
              padding: 3px 8px;
              border-radius: 100vw;
            }
            .support-desc {
              font-size: 0.86rem;
              color: var(--text-secondary);
              line-height: 1.55;
              margin-bottom: 18px;
            }
            .btn-talk-team {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px;
              background: var(--color-radish);
              color: var(--color-cream);
              border-radius: 100vw;
              font-size: 0.88rem;
              font-weight: 600;
              text-decoration: none;
              transition: transform 0.2s, opacity 0.2s;
            }
            .btn-talk-team:hover {
              opacity: 0.92;
              transform: translateY(-1px);
            }

            .btn-signout {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px;
              border-radius: 100vw;
              border: 1px solid rgba(16, 52, 42, 0.15);
              background: transparent;
              color: var(--text-muted);
              font-size: 0.85rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            }
            .btn-signout:hover {
              color: var(--color-pine);
              border-color: var(--color-pine);
              background: var(--color-cream-2);
            }

            /* Main Projects Area */
            .account-main-area {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .projects-top-bar {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 16px;
              flex-wrap: wrap;
            }
            .projects-main-title {
              font-family: var(--font-display);
              font-size: 1.45rem;
              font-weight: 700;
              color: var(--color-pine);
              line-height: 1.1;
            }
            .projects-main-sub {
              font-size: 0.88rem;
              color: var(--text-secondary);
              margin-top: 4px;
            }

            .projects-tabs {
              display: inline-flex;
              align-items: center;
              background: rgba(16, 52, 42, 0.06);
              padding: 4px;
              border-radius: 100vw;
              gap: 2px;
            }
            .tab-btn {
              padding: 8px 16px;
              border-radius: 100vw;
              font-size: 0.82rem;
              font-weight: 600;
              color: var(--text-secondary);
              background: transparent;
              border: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: all 0.2s;
            }
            .tab-btn.active {
              background: #fff;
              color: var(--color-pine);
              box-shadow: 0 2px 8px rgba(16, 52, 42, 0.08);
            }
            .tab-count {
              font-family: var(--font-mono);
              font-size: 0.7rem;
              background: rgba(16, 52, 42, 0.1);
              padding: 1px 6px;
              border-radius: 100vw;
            }
            .tab-btn.active .tab-count {
              background: var(--color-pine);
              color: var(--color-cream);
            }

            /* Empty Projects State */
            .empty-projects-state {
              background: #fff;
              border: 1px dashed rgba(16, 52, 42, 0.2);
              border-radius: 24px;
              padding: 60px 32px;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .empty-icon-wrap {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: var(--color-cream);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            .empty-title {
              font-family: var(--font-display);
              font-size: 1.25rem;
              font-weight: 700;
              color: var(--color-pine);
              margin-bottom: 8px;
            }
            .empty-desc {
              font-size: 0.92rem;
              color: var(--text-secondary);
              max-width: 440px;
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .btn-plant-project {
              padding: 13px 26px;
              border-radius: 100vw;
              background: var(--color-radish);
              color: var(--color-cream);
              font-size: 0.9rem;
              font-weight: 600;
              cursor: pointer;
              border: 1px solid var(--color-radish);
              transition: transform 0.2s, opacity 0.2s;
            }
            .btn-plant-project:hover {
              opacity: 0.92;
              transform: translateY(-1px);
            }

            /* Folders Stack System */
            .folders-stack {
              display: flex;
              flex-direction: column;
              padding-top: 10px;
              padding-bottom: 24px;
            }

            .folder-item {
              position: relative;
              transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
                          box-shadow 0.28s ease,
                          margin 0.3s ease;
            }

            /* Folder stacking when collapsed */
            .folder-item.is-collapsed + .folder-item.is-collapsed {
              margin-top: -22px;
            }

            .folder-item.is-expanded {
              margin-top: 16px;
              margin-bottom: 28px;
              transform: translateY(-4px);
            }

            .folder-item.is-expanded:first-child {
              margin-top: 0;
            }

            .folder-item.is-expanded + .folder-item {
              margin-top: 0;
            }

            .folder-item + .folder-item.is-expanded {
              margin-top: 20px;
            }

            /* Physical lift on hover */
            .folder-item:hover {
              transform: translateY(-8px);
              z-index: 60 !important;
            }

            .folder-item:hover .folder-body {
              border-color: rgba(16, 52, 42, 0.32);
              box-shadow: 0 18px 38px -6px rgba(16, 52, 42, 0.14), 0 4px 12px rgba(0, 0, 0, 0.04);
            }

            .folder-item:hover .folder-tab {
              border-color: rgba(16, 52, 42, 0.32);
              background: #FFFFFF;
            }

            /* Physical Folder Tab */
            .folder-tab {
              display: inline-flex;
              align-items: center;
              gap: 12px;
              padding: 8px 18px;
              background: #FFFFFF;
              border: 1px solid rgba(16, 52, 42, 0.14);
              border-bottom: 1px solid #FFFFFF;
              border-radius: 12px 12px 0 0;
              margin-bottom: -1px;
              position: relative;
              z-index: 5;
              cursor: pointer;
              user-select: none;
              transition: border-color 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 -3px 8px rgba(16, 52, 42, 0.02);
            }

            /* Staggered physical tabs across the stack */
            .folder-item:nth-child(3n + 1) .folder-tab {
              margin-left: 20px;
            }
            .folder-item:nth-child(3n + 2) .folder-tab {
              margin-left: 210px;
            }
            .folder-item:nth-child(3n + 3) .folder-tab {
              margin-left: 400px;
            }

            /* Physical, Non-AI Status Badge */
            .folder-tab-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 3px 9px;
              border-radius: 6px;
              font-family: var(--font-mono);
              font-size: 0.68rem;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .badge-progress {
              background: rgba(166, 56, 24, 0.09);
              color: #A63818;
              border: 1px solid rgba(166, 56, 24, 0.24);
            }

            .badge-completed {
              background: rgba(21, 101, 53, 0.09);
              color: #156535;
              border: 1px solid rgba(21, 101, 53, 0.24);
            }

            .tab-loading-bar-track {
              display: inline-flex;
              width: 32px;
              height: 5px;
              border-radius: 100vw;
              background: rgba(166, 56, 24, 0.22);
              overflow: hidden;
              flex-shrink: 0;
            }

            .tab-loading-bar-fill {
              height: 100%;
              border-radius: 100vw;
              background: #A63818;
              transition: width 0.6s ease;
            }

            .tab-completed-ring {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #15803D;
              color: #FFFFFF;
              flex-shrink: 0;
              box-shadow: 0 1px 3px rgba(21, 128, 61, 0.25);
            }

            .folder-tab-code {
              font-family: var(--font-mono);
              font-size: 0.68rem;
              font-weight: 600;
              letter-spacing: 0.06em;
              color: #8C827A;
            }

            /* Folder Body */
            .folder-body {
              background: #FFFFFF;
              border: 1px solid rgba(16, 52, 42, 0.14);
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 4px 20px -2px rgba(16, 52, 42, 0.06);
              transition: border-color 0.25s ease, box-shadow 0.25s ease;
              position: relative;
              z-index: 3;
            }

            .folder-item.is-expanded .folder-body {
              border-color: rgba(16, 52, 42, 0.28);
              box-shadow: 0 16px 36px -6px rgba(16, 52, 42, 0.12);
            }

            /* Folder Header */
            .folder-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              padding: 20px 26px;
              cursor: pointer;
              user-select: none;
              background: #FFFFFF;
              border-bottom: 1px solid transparent;
              transition: background 0.2s ease, border-color 0.2s ease;
            }

            .folder-item.is-expanded .folder-header {
              border-bottom: 1px solid rgba(16, 52, 42, 0.08);
              background: rgba(16, 52, 42, 0.015);
            }

            .folder-title-wrap {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .folder-category {
              font-family: var(--font-mono);
              font-size: 0.7rem;
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.08em;
              margin-bottom: 2px;
            }

            .folder-title {
              font-family: var(--font-display);
              font-size: 1.28rem;
              font-weight: 700;
              color: var(--color-pine);
              line-height: 1.2;
              margin: 0;
            }

            .folder-header-right {
              display: flex;
              align-items: center;
              gap: 16px;
              flex-shrink: 0;
            }

            .folder-mini-progress {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .mini-phase-text {
              font-size: 0.8rem;
              color: var(--text-secondary);
              max-width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .folder-mini-bar-track {
              width: 54px;
              height: 6px;
              border-radius: 100vw;
              background: rgba(16, 52, 42, 0.12);
              overflow: hidden;
              flex-shrink: 0;
            }

            .folder-mini-bar-fill {
              height: 100%;
              border-radius: 100vw;
              background: linear-gradient(90deg, var(--color-pine), #A63818);
              transition: width 0.6s ease;
            }

            .mini-status-done {
              font-size: 0.72rem;
              font-weight: 700;
              color: #15803D;
              background: rgba(21, 128, 61, 0.1);
              padding: 3px 8px;
              border-radius: 6px;
            }

            .folder-toggle-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 1px solid rgba(16, 52, 42, 0.12);
              background: #FAF8F5;
              color: var(--color-pine);
              cursor: pointer;
              transition: all 0.25s ease;
            }

            .folder-toggle-btn:hover {
              background: rgba(16, 52, 42, 0.08);
            }

            .folder-toggle-btn.open {
              background: var(--color-pine);
              color: var(--color-cream);
              border-color: var(--color-pine);
              transform: rotate(180deg);
            }

            /* Folder Expanded Content */
            .folder-expanded-content {
              padding: 24px 26px;
              display: flex;
              flex-direction: column;
              gap: 22px;
              background: #FFFFFF;
            }

            /* Progress Box */
            .project-progress-box {
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.08);
              border-radius: 16px;
              padding: 16px 20px;
            }
            .progress-info-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 0.85rem;
            }
            .phase-label {
              color: var(--text-secondary);
            }
            .phase-label strong {
              color: var(--color-pine);
            }
            .progress-percent {
              font-weight: 700;
              color: var(--color-pine);
              font-size: 0.9rem;
            }
            .progress-track {
              height: 8px;
              background: rgba(16, 52, 42, 0.12);
              border-radius: 100vw;
              overflow: hidden;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, var(--color-pine) 0%, var(--color-radish) 100%);
              border-radius: 100vw;
              transition: width 0.6s ease;
            }

            /* Brand Milestones Section */
            .milestones-section {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .milestones-top-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .milestones-heading {
              font-family: var(--font-mono);
              font-size: 0.74rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.09em;
              color: var(--color-pine);
              margin: 0;
            }

            .milestones-counter {
              font-family: var(--font-mono);
              font-size: 0.72rem;
              font-weight: 700;
              color: var(--color-pine);
              background: rgba(16, 52, 42, 0.08);
              padding: 2px 8px;
              border-radius: 100vw;
            }

            .milestones-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }

            .milestone-tile {
              display: flex;
              flex-direction: column;
              gap: 8px;
              padding: 12px 14px;
              border-radius: 14px;
              transition: all 0.2s ease;
            }

            .milestone-tile.is-done {
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.12);
            }

            .milestone-tile.is-pending {
              background: transparent;
              border: 1px dashed rgba(16, 52, 42, 0.16);
            }

            .milestone-tile-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
            }

            .milestone-checkbox-wrap {
              display: inline-flex;
              align-items: center;
            }

            .milestone-checkbox {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 18px;
              height: 18px;
              border-radius: 5px;
              transition: all 0.2s ease;
            }

            .milestone-checkbox.is-done {
              background: var(--color-pine);
              border: 1px solid var(--color-pine);
              box-shadow: 0 1px 3px rgba(16, 52, 42, 0.15);
            }

            .milestone-checkbox.is-unconfirmed {
              background: #FFFFFF;
              border: 1.5px solid rgba(16, 52, 42, 0.3);
            }

            .milestone-tag {
              font-family: var(--font-mono);
              font-size: 0.66rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }

            .milestone-tile.is-done .milestone-tag {
              color: var(--color-pine);
            }

            .milestone-tile.is-executing .milestone-tag {
              color: var(--color-radish);
            }

            .milestone-tile.is-pending .milestone-tag {
              color: var(--text-muted);
            }

            .milestone-tile-title {
              font-size: 0.83rem;
              line-height: 1.42;
              margin: 0;
            }

            .milestone-tile.is-done .milestone-tile-title {
              color: var(--color-pine);
              font-weight: 600;
            }

            .milestone-tile.is-executing .milestone-tile-title {
              color: var(--color-pine);
              font-weight: 600;
            }

            .milestone-tile.is-pending .milestone-tile-title {
              color: var(--text-secondary);
            }

            /* Footer */
            .project-card-footer {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 18px;
              border-top: 1px solid rgba(16, 52, 42, 0.08);
              flex-wrap: wrap;
              gap: 16px;
            }
            .date-info {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }
            .date-label {
              font-size: 0.72rem;
              font-family: var(--font-mono);
              color: var(--text-muted);
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }
            .date-value {
              font-size: 0.92rem;
              color: var(--color-pine);
            }

            .project-actions {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .btn-project-link {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 9px 18px;
              border-radius: 100vw;
              font-size: 0.82rem;
              font-weight: 600;
              text-decoration: none;
              transition: all 0.2s;
            }
            .btn-project-link.staging {
              background: transparent;
              border: 1px solid rgba(16, 52, 42, 0.2);
              color: var(--color-pine);
            }
            .btn-project-link.staging:hover {
              background: var(--color-cream);
              border-color: var(--color-pine);
            }
            .btn-project-link.live {
              background: var(--color-pine);
              border: 1px solid var(--color-pine);
              color: var(--color-cream);
            }
            .btn-project-link.live:hover {
              opacity: 0.9;
              transform: translateY(-1px);
            }

            @media (max-width: 960px) {
              .account-modal-overlay {
                padding: 0;
              }
              .account-modal-container {
                width: 100vw;
                height: 100vh;
                height: 100dvh;
                max-height: 100dvh;
                border-radius: 0;
                border: none;
              }
              .account-modal-header {
                padding: 14px 18px;
              }
              .account-modal-title {
                font-size: 1.1rem;
              }
              .account-modal-sub {
                font-size: 0.74rem;
              }
              .avatar-chip {
                width: 38px;
                height: 38px;
                font-size: 0.85rem;
              }
              .account-modal-close {
                width: 32px;
                height: 32px;
              }
              .account-modal-content {
                padding: 18px 16px;
                overflow-x: hidden;
              }
              .account-portal-layout {
                grid-template-columns: 1fr;
                gap: 22px;
              }
              .projects-top-bar {
                flex-direction: column;
                align-items: stretch;
                gap: 14px;
              }
              .projects-main-title {
                font-size: 1.25rem;
              }
              .projects-tabs {
                width: 100%;
                display: flex;
                padding: 4px;
                box-sizing: border-box;
              }
              .tab-btn {
                flex: 1;
                justify-content: center;
                text-align: center;
                padding: 7px 8px;
                font-size: 0.74rem;
                white-space: nowrap;
              }
              .folder-item:nth-child(n) .folder-tab {
                margin-left: 12px;
              }
              .folder-tab {
                padding: 6px 12px;
                gap: 8px;
              }
              .folder-tab-badge {
                font-size: 0.65rem;
                padding: 2.5px 7px;
                gap: 5px;
              }
              .folder-tab-code {
                font-size: 0.62rem;
              }
              .mini-phase-text {
                display: none;
              }
              .folder-header {
                padding: 15px 16px;
                gap: 10px;
              }
              .folder-title {
                font-size: 1.05rem;
              }
              .folder-expanded-content {
                padding: 18px 16px;
                gap: 16px;
              }
              .milestones-grid {
                grid-template-columns: 1fr;
              }
              .milestone-tile {
                padding: 12px 14px;
              }
              .project-card-footer {
                flex-direction: column;
                align-items: stretch;
                gap: 14px;
              }
              .date-info {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              }
              .project-actions {
                width: 100%;
                flex-direction: column;
                gap: 8px;
              }
              .btn-project-link {
                width: 100%;
                justify-content: center;
                text-align: center;
                padding: 10px 14px;
                box-sizing: border-box;
              }
            }

            @media (max-width: 640px) {
              .account-modal-header {
                padding: 12px 14px;
              }
              .account-modal-content {
                padding: 14px 12px;
              }
              .portal-card {
                padding: 16px 14px;
                border-radius: 16px;
              }
              .profile-fields-list {
                gap: 12px;
              }
              .folder-item:hover {
                transform: none;
              }
              .folder-item.is-collapsed + .folder-item.is-collapsed {
                margin-top: -14px;
              }
              .folder-item:nth-child(n) .folder-tab {
                margin-left: 8px;
              }
              .folder-header {
                padding: 13px 14px;
              }
              .folder-title {
                font-size: 0.98rem;
              }
              .folder-category {
                font-size: 0.62rem;
              }
              .folder-mini-bar-track {
                width: 38px;
                height: 5px;
              }
              .folder-toggle-btn {
                width: 28px;
                height: 28px;
                min-width: 28px;
              }
              .folder-expanded-content {
                padding: 14px 12px;
                gap: 14px;
              }
              .project-progress-box {
                padding: 12px;
                border-radius: 12px;
              }
              .milestone-tile {
                padding: 10px 12px;
              }
              .milestone-tile-title {
                font-size: 0.78rem;
              }
              .btn-company-cancel, .btn-company-save {
                padding: 6px 10px;
                font-size: 0.74rem;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
