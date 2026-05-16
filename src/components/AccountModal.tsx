import { motion, AnimatePresence } from 'motion/react'
import { X, User, CreditCard, History, Layout, ExternalLink, Download, AlertCircle, PlusCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { user } = useAuth()

  // Bloquear scroll del body al abrir el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  // Datos de ejemplo mapeados a lo que será la estructura real de Supabase
  // Mapeo futuro: 
  // accountData.businessName -> public.clinics.name
  // accountData.phone -> public.clinics.phone
  // accountData.contactName -> public.users.full_name
  const accountData = {
    businessName: "Clínica Dental Ravyn", 
    contactName: user?.user_metadata?.full_name || "Usuario de Prueba",
    email: user?.email || "test@ravyn.mx",
    phone: "+52 899 123 4567"
  }

  // Mapeo futuro: public.clinics.plan
  const subscription = {
    plan: "Plan Completo",
    status: "active", // active, warning, suspended
    startDate: "01 Marzo 2026",
    nextBilling: "01 Junio 2026",
    amount: "$1,400 MXN"
  }

  const paymentHistory = [
    { date: "01 Mayo 2026", concept: "Plan Completo", amount: "$1,400 MXN", status: "Pagado" },
    { date: "01 Abril 2026", concept: "Plan Completo", amount: "$1,400 MXN", status: "Pagado" },
    { date: "01 Marzo 2026", concept: "Plan Completo", amount: "$1,400 MXN", status: "Pagado" },
  ]

  // Mapeo futuro: public.clinics.subdomain + ".ravynset.com"
  const systemStatus = {
    webUrl: "https://clinicatest.ravynset.com",
    crm: "activo",
    whatsapp: "activo",
    reputation: "activo"
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
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="account-modal-header">
              <h2 className="account-modal-title">Gestión de Cuenta</h2>
              <button className="account-modal-close" onClick={onClose} type="button">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="account-modal-content">
              <div className="account-grid">
                
                {/* Sección 1 — Resumen de cuenta */}
                <div className="account-card section-resumen">
                  <div className="card-header">
                    <User className="w-5 h-5 text-accent" />
                    <h3>Resumen de cuenta</h3>
                  </div>
                  <div className="card-body">
                    <div className="data-group">
                      <label>Negocio</label>
                      <p>{accountData.businessName}</p>
                    </div>
                    <div className="data-group">
                      <label>Contacto</label>
                      <p>{accountData.contactName}</p>
                    </div>
                    <div className="data-group">
                      <label>Email</label>
                      <p>{accountData.email}</p>
                    </div>
                    <div className="data-group">
                      <label>Teléfono</label>
                      <p>{accountData.phone}</p>
                    </div>
                    <button className="btn-edit mt-4" type="button" onClick={() => console.log('Editar datos')}>Editar datos</button>
                  </div>
                </div>

                {/* Sección 2 — Suscripción activa */}
                <div className="account-card section-suscripcion">
                  <div className="card-header">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <h3>Suscripción activa</h3>
                  </div>
                  <div className="card-body">
                    <div className="plan-status-row">
                      <div className="plan-info">
                        <span className="plan-name">{subscription.plan}</span>
                        <span className="status-badge success">Activa</span>
                      </div>
                      <div className="price-info">
                        <span className="amount">{subscription.amount}</span>
                        <span className="period">/ mes</span>
                      </div>
                    </div>
                    <div className="billing-details mt-6">
                      <div className="detail-item">
                        <span>Fecha de inicio</span>
                        <strong>{subscription.startDate}</strong>
                      </div>
                      <div className="detail-item">
                        <span>Próximo cobro</span>
                        <strong>{subscription.nextBilling}</strong>
                      </div>
                    </div>
                    <div className="actions-row mt-8">
                      <button className="btn-primary-small" type="button" onClick={() => console.log('Cambiar plan')}>Cambiar plan</button>
                      <button className="btn-cancel" type="button" onClick={() => console.log('Cancelar suscripción')}>Cancelar suscripción</button>
                    </div>
                  </div>
                </div>

                {/* Sección 5 — Mi sistema */}
                <div className="account-card section-sistema">
                  <div className="card-header">
                    <Layout className="w-5 h-5 text-accent" />
                    <h3>Mi sistema</h3>
                  </div>
                  <div className="card-body">
                    <div className="system-links">
                      <a href={systemStatus.webUrl} target="_blank" rel="noreferrer" className="system-link">
                        <span>Ver mi sitio web</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="system-status-list mt-6">
                      <div className="status-item">
                        <span>CRM</span>
                        <span className="status-dot active">activo</span>
                      </div>
                      <div className="status-item">
                        <span>Recordatorios WhatsApp</span>
                        <span className="status-dot active">activo</span>
                      </div>
                      <div className="status-item">
                        <span>Motor de Reputación</span>
                        <span className="status-dot active">activo</span>
                      </div>
                    </div>
                    <button className="btn-crm mt-8" type="button" onClick={() => console.log('Ir al CRM')}>Ir al CRM</button>
                  </div>
                </div>

                {/* Sección 3 — Historial de pagos */}
                <div className="account-card section-historial lg:col-span-2">
                  <div className="card-header">
                    <History className="w-5 h-5 text-accent" />
                    <h3>Historial de pagos (6 meses)</h3>
                  </div>
                  <div className="card-body">
                    <div className="history-table-wrapper">
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Concepto</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((pay, i) => (
                            <tr key={i}>
                              <td>{pay.date}</td>
                              <td>{pay.concept}</td>
                              <td>{pay.amount}</td>
                              <td><span className="status-text">{pay.status}</span></td>
                              <td>
                                <button className="btn-download" title="Descargar comprobante" type="button" onClick={() => console.log('Descargar', pay.date)}>
                                  <Download className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sección 4 — Método de pago */}
                <div className="account-card section-pago">
                  <div className="card-header flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <h3>Método de pago</h3>
                    </div>
                  </div>
                  <div className="card-body flex flex-col h-full">
                    <div className="bank-data">
                      <div className="data-row">
                        <span>Método actual:</span>
                        <strong>Transferencia SPEI</strong>
                      </div>
                      <div className="data-row">
                        <span>Banco:</span>
                        <strong>BBVA</strong>
                      </div>
                      <div className="data-row">
                        <span>Titular:</span>
                        <strong>Ravyn Studio S.A. de C.V.</strong>
                      </div>
                      <div className="data-row">
                        <span>CLABE:</span>
                        <strong className="font-mono">0123 4567 8901 2345 67</strong>
                      </div>
                    </div>
                    <div className="payment-instructions mt-4">
                      <p>Realiza tu transferencia antes del día <strong>05</strong> de cada mes con el concepto: <strong>{accountData.businessName} + {subscription.plan}</strong></p>
                    </div>
                    
                    {/* Botón añadido para agregar tarjeta */}
                    <div className="mt-auto pt-6">
                      <button className="btn-add-card" type="button" onClick={() => console.log('Añadir tarjeta Stripe/MercadoPago')}>
                        <PlusCircle className="w-4 h-4" />
                        Añadir tarjeta de crédito/débito
                      </button>
                    </div>
                  </div>
                </div>

              </div>
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
              padding: 2vh;
              pointer-events: auto;
            }

            .account-modal-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(15px);
              z-index: 0;
            }

            .account-modal-container {
              position: relative;
              width: 95vw;
              height: 90vh;
              background: #0d0d0d;
              border: 1px solid var(--border);
              border-radius: 32px;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
              z-index: 1;
              pointer-events: auto;
            }

            .account-modal-header {
              padding: 24px 40px;
              border-bottom: 1px solid var(--border);
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: var(--bg-surface);
            }

            .account-modal-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--text);
            }

            .account-modal-close {
              color: var(--text-muted);
              transition: color 0.2s;
              cursor: pointer;
              background: none;
              border: none;
              padding: 8px;
            }

            .account-modal-close:hover {
              color: var(--text);
            }

            .account-modal-content {
              flex: 1;
              overflow-y: auto;
              padding: 40px;
              background: #0d0d0d;
            }

            .account-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 24px;
              max-width: 1400px;
              margin: 0 auto;
            }

            .account-card {
              background: var(--bg-surface);
              border: 1px solid var(--border);
              border-radius: 24px;
              padding: 32px;
              display: flex;
              flex-direction: column;
            }

            .card-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 24px;
            }

            .card-header h3 {
              font-size: 1.1rem;
              font-weight: 700;
              color: var(--text);
            }

            .data-group {
              margin-bottom: 16px;
            }

            .data-group label {
              font-size: 0.8rem;
              color: var(--text-muted);
              display: block;
              margin-bottom: 4px;
            }

            .data-group p {
              font-size: 1rem;
              font-weight: 500;
              color: var(--text);
            }

            .btn-edit {
              font-size: 0.85rem;
              font-weight: 600;
              color: var(--accent);
              text-decoration: underline;
              width: fit-content;
              background: none;
              border: none;
              cursor: pointer;
            }

            .plan-name {
              font-size: 1.4rem;
              font-weight: 800;
              color: var(--text);
            }

            .status-badge {
              font-size: 0.7rem;
              font-weight: 800;
              padding: 4px 12px;
              border-radius: 100vw;
              text-transform: uppercase;
              width: fit-content;
            }

            .status-badge.success {
              background: rgba(34, 197, 94, 0.1);
              color: #4ade80;
              border: 1px solid rgba(34, 197, 94, 0.2);
            }

            .btn-primary-small {
              background: var(--text);
              color: #000;
              padding: 10px 20px;
              border-radius: 12px;
              font-weight: 700;
              font-size: 0.9rem;
              border: none;
              cursor: pointer;
            }

            /* Botón Cancelar modificado a rojo */
            .btn-cancel {
              font-size: 0.85rem;
              font-weight: 600;
              color: #ef4444; /* Rojo para advertencia */
              text-decoration: none;
              background: rgba(239, 68, 68, 0.1);
              padding: 8px 16px;
              border-radius: 8px;
              border: 1px solid rgba(239, 68, 68, 0.2);
              cursor: pointer;
              transition: all 0.2s;
            }

            .btn-cancel:hover {
              background: rgba(239, 68, 68, 0.2);
            }

            .btn-crm {
              width: 100%;
              padding: 12px;
              border: 1px solid var(--border);
              border-radius: 12px;
              color: var(--text);
              font-weight: 600;
              transition: all 0.2s;
              background: none;
              cursor: pointer;
            }

            .btn-crm:hover {
              background: var(--bg-raised);
              border-color: var(--accent);
            }

            .history-table th {
              text-align: left;
              font-size: 0.8rem;
              color: var(--text-muted);
              padding: 12px;
              border-bottom: 1px solid var(--border);
            }

            .history-table td {
              padding: 16px 12px;
              font-size: 0.95rem;
              border-bottom: 1px solid var(--border);
            }

            .btn-download {
              color: var(--text-muted);
              transition: color 0.2s;
              background: none;
              border: none;
              cursor: pointer;
              padding: 8px;
            }

            .btn-download:hover {
              color: var(--accent);
            }

            .btn-add-card {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px;
              background: transparent;
              border: 1px dashed var(--border);
              border-radius: 12px;
              color: var(--text);
              font-size: 0.9rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            }

            .btn-add-card:hover {
              border-color: var(--accent);
              color: var(--accent);
              background: rgba(255, 255, 255, 0.03);
            }

            @media (max-width: 1100px) {
              .account-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }

            @media (max-width: 768px) {
              .account-grid {
                grid-template-columns: 1fr;
              }
              .account-modal-content {
                padding: 24px;
              }
              .account-modal-container {
                height: 95vh;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
