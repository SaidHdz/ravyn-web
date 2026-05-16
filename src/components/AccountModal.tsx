import { motion, AnimatePresence } from 'motion/react'
import { X, User, CreditCard, History, Layout, ExternalLink, Download, AlertCircle, PlusCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState, useRef } from 'react'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { user } = useAuth()
  const [view, setView] = useState<'overview' | 'add-card'>('overview')
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card'>('transfer')
  
  // Estados para la tarjeta 3D
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [isSavingCard, setIsSavingCard] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // Bloquear scroll del body al abrir el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setView('overview') 
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  // Lógica de rotación 3D para la tarjeta
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Validaciones y formateo de inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(val);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingCard(true)
    setTimeout(() => {
      setIsSavingCard(false)
      setPaymentMethod('card')
      setView('overview')
    }, 1500)
  }

  // Datos de ejemplo
  const accountData = {
    businessName: "Clínica Dental Ravyn", 
    contactName: user?.user_metadata?.full_name || "Usuario de Prueba",
    email: user?.email || "test@ravyn.mx",
    phone: "+52 899 123 4567"
  }

  const subscription = {
    plan: "Plan Completo",
    status: "active",
    startDate: "01 Marzo 2026",
    nextBilling: "01 Junio 2026",
    amount: "$1,400"
  }

  const paymentHistory = [
    { date: "01 Mayo 2026", concept: "Plan Completo", amount: "$1,400 MXN", status: "Pagado" },
    { date: "01 Abril 2026", concept: "Plan Completo", amount: "$1,400 MXN", status: "Pagado" },
    { date: "01 Marzo 2026", concept: "Plan Completo", amount: "$1,400 MXN", status: "Pagado" },
  ]

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
              <div className="flex items-center gap-4">
                {view === 'add-card' && (
                  <button className="btn-back" onClick={() => setView('overview')}>
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="account-modal-title">
                  {view === 'overview' ? 'Gestión de Cuenta' : 'Añadir tarjeta'}
                </h2>
              </div>
              <button className="account-modal-close" onClick={onClose} type="button">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="account-modal-content">
              {view === 'overview' ? (
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
                      <button className="btn-edit mt-4" type="button">Editar datos</button>
                    </div>
                  </div>

                  {/* Sección 2 — Suscripción activa */}
                  <div className="account-card section-suscripcion">
                    <div className="card-header">
                      <CreditCard className="w-5 h-5 text-accent" />
                      <h3>Suscripción activa</h3>
                    </div>
                    <div className="card-body flex flex-col h-full">
                      <div className="plan-status-row">
                        <div className="plan-info">
                          <span className="plan-name">{subscription.plan}</span>
                          <span className="status-badge success mt-2">Activa</span>
                        </div>
                        <div className="price-info">
                          <span className="amount text-accent">{subscription.amount} MXN</span>
                          <span className="period">/ mes</span>
                        </div>
                      </div>
                      <div className="billing-details mt-8">
                        <div className="detail-item">
                          <span className="label">Fecha de inicio</span>
                          <strong className="value">{subscription.startDate}</strong>
                        </div>
                        <div className="detail-item mt-3">
                          <span className="label">Próximo cobro</span>
                          <strong className="value">{subscription.nextBilling}</strong>
                        </div>
                      </div>
                      <div className="actions-row mt-auto pt-8">
                        <button className="btn-action-white-text" type="button">Cambiar plan</button>
                        <button className="btn-cancel" type="button">Cancelar suscripción</button>
                      </div>
                    </div>
                  </div>

                  {/* Sección 5 — Mi sistema */}
                  <div className="account-card section-sistema">
                    <div className="card-header">
                      <Layout className="w-5 h-5 text-accent" />
                      <h3>Mi sistema</h3>
                    </div>
                    <div className="card-body flex flex-col h-full">
                      <div className="system-links mb-6">
                        <a href={systemStatus.webUrl} target="_blank" rel="noreferrer" className="system-link">
                          <span>Ver mi sitio web</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="system-status-list gap-4 flex flex-col">
                        <div className="status-item">
                          <span>CRM</span>
                          <span className="status-dot active">activo</span>
                        </div>
                        <div className="status-item">
                          <span>WhatsApp Business</span>
                          <span className="status-dot active">activo</span>
                        </div>
                        <div className="status-item">
                          <span>Motor de Reputación</span>
                          <span className="status-dot active">activo</span>
                        </div>
                      </div>
                      <button className="btn-crm mt-auto pt-6" type="button">Ir al CRM</button>
                    </div>
                  </div>

                  {/* Sección 3 — Historial de pagos */}
                  <div className="account-card section-historial lg:col-span-2">
                    <div className="card-header">
                      <History className="w-5 h-5 text-accent" />
                      <h3>Historial de pagos</h3>
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
                                  <button className="btn-download flex items-center justify-center text-white" title="Descargar comprobante" type="button">
                                    <Download className="w-4 h-4 text-white" />
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
                    <div className="card-header">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <h3>Método de pago</h3>
                    </div>
                    <div className="card-body flex flex-col h-full">
                      {paymentMethod === 'transfer' ? (
                        <>
                          <div className="bank-data flex flex-col gap-3">
                            <div className="data-row flex justify-between items-center">
                              <span className="text-muted">Método:</span>
                              <strong className="text-white ml-2">Transferencia SPEI</strong>
                            </div>
                            <div className="data-row flex justify-between items-center">
                              <span className="text-muted">Banco:</span>
                              <strong className="text-white ml-2">BBVA</strong>
                            </div>
                            <div className="data-row flex justify-between items-center">
                              <span className="text-muted">Titular:</span>
                              <strong className="text-white ml-2">Ravyn Studio S.A.</strong>
                            </div>
                            <div className="data-row flex justify-between items-center">
                              <span className="text-muted">CLABE:</span>
                              <strong className="font-mono text-white ml-2 text-sm">0123 4567 8901 2345 67</strong>
                            </div>
                          </div>
                          <div className="payment-instructions mt-4 bg-white/5 p-4 rounded-xl text-sm leading-relaxed border border-white/5">
                            <p>Concepto: <strong>{accountData.businessName}</strong></p>
                          </div>
                          <div className="mt-auto pt-6">
                            <button className="btn-action-white-text" type="button" onClick={() => setView('add-card')}>
                              <PlusCircle className="w-4 h-4" />
                              Cambiar a tarjeta
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="linked-card-premium relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                            <div className="linked-card-header relative z-10">
                              <CreditCard className="w-6 h-6 text-white/80" />
                              <span className="linked-card-chip" />
                            </div>
                            <div className="linked-card-body relative z-10">
                              <p className="linked-card-number">•••• •••• •••• {cardNumber.slice(-4) || '4242'}</p>
                              <div className="flex justify-between items-end mt-5">
                                <div>
                                  <p className="linked-card-label">Titular</p>
                                  <p className="linked-card-val uppercase">{cardName || 'Usuario'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="linked-card-label">Expira</p>
                                  <p className="linked-card-val">{cardExpiry || '12/26'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <button className="text-accent text-sm font-semibold hover:opacity-70 transition-opacity" onClick={() => setPaymentMethod('transfer')}>
                              ← Volver a transferencia bancaria
                            </button>
                          </div>
                          <div className="mt-auto pt-6">
                            <button className="btn-action-white-text" type="button" onClick={() => setView('add-card')}>
                              Actualizar tarjeta
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                /* VISTA: AÑADIR TARJETA */
                <div className="add-card-view">
                  <div className="add-card-grid">
                    <div className="card-preview-section">
                      <div className="perspective-[1200px] w-full max-w-[400px] mx-auto">
                        <div
                          ref={cardRef}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                            transformStyle: 'preserve-3d'
                          }}
                          className="card-3d-body"
                        >
                          <div className="card-inner-content" style={{ transform: 'translateZ(60px)' }}>
                            <div className="card-chip mb-8" />
                            <div className="card-number-display mb-10">
                              {cardNumber.replace(/(\d{4})/g, '$1 ').trim() || '•••• •••• •••• ••••'}
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="flex flex-col gap-1">
                                <span className="card-label">Titular</span>
                                <span className="card-value uppercase">{cardName || 'Tu nombre aquí'}</span>
                              </div>
                              <div className="flex flex-col gap-1 items-end">
                                <span className="card-label">Expira</span>
                                <span className="card-value">{cardExpiry || 'MM/AA'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-form-section">
                      <form onSubmit={handleSaveCard} className="card-form">
                        <div className="form-group">
                          <label>Nombre del titular</label>
                          <input 
                            type="text" 
                            placeholder="Como aparece en la tarjeta"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Número de tarjeta</label>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={16}
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Fecha de expiración</label>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              pattern="[0-9/]*"
                              maxLength={5}
                              placeholder="MM/AA"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>CVV</label>
                            <input 
                              type="password" 
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={4}
                              placeholder="000"
                              value={cardCvv}
                              onChange={handleCvvChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mt-4">
                          <button type="button" className="btn-cancel-card flex-1" onClick={() => setView('overview')} disabled={isSavingCard}>
                            Cancelar
                          </button>
                          <button type="submit" className="btn-save-card flex-[2]" disabled={isSavingCard}>
                            {isSavingCard ? (
                              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                              'Guardar tarjeta'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <style>{`
            .account-modal-overlay { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2vh; pointer-events: auto; }
            .account-modal-backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.92); backdrop-filter: blur(25px); z-index: 0; }
            .account-modal-container { position: relative; width: 95vw; height: 90vh; background: #080808; border: 1px solid var(--border); border-radius: 32px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 50px 150px -20px rgba(0,0,0,0.8); z-index: 1; pointer-events: auto; }
            .account-modal-header { padding: 24px 40px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02); }
            .btn-back { color: var(--text-muted); transition: color 0.2s; background: none; border: none; cursor: pointer; padding: 8px; }
            .btn-back:hover { color: var(--text); }
            .account-modal-title { font-size: 1.5rem; font-weight: 700; color: var(--text); }
            .account-modal-close { color: var(--text-muted); transition: color 0.2s; cursor: pointer; background: none; border: none; padding: 8px; }
            .account-modal-close:hover { color: var(--text); }
            .account-modal-content { flex: 1; overflow-y: auto; padding: 40px; }
            .account-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1400px; margin: 0 auto; }
            .account-card { background: #111; border: 1px solid var(--border); border-radius: 24px; padding: 32px; display: flex; flex-direction: column; transition: border-color 0.3s; }
            .account-card:hover { border-color: rgba(255,255,255,0.1); }
            .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
            .card-header h3 { font-size: 1rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
            .data-group { margin-bottom: 20px; }
            .data-group label { font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px; }
            .data-group p { font-size: 1rem; font-weight: 500; color: var(--text); }
            .btn-edit { font-size: 0.85rem; font-weight: 600; color: var(--accent); background: none; border: none; cursor: pointer; text-decoration: underline; padding: 0; }
            .plan-name { font-size: 1.4rem; font-weight: 800; color: var(--text); }
            .status-badge.success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); font-size: 0.65rem; padding: 4px 10px; border-radius: 100vw; font-weight: 800; }
            .price-info .amount { display: block; font-size: 1.25rem; font-weight: 700; color: #fff; line-height: 1; }
            .price-info .period { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; display: block; }
            .detail-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
            .detail-item .label { color: var(--text-muted); }
            .detail-item .value { color: var(--text); font-weight: 500; }
            
            .actions-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
            
            /* Botones principales ahora con texto blanco y fondo adaptativo */
            .btn-action-white-text { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
            .btn-action-white-text:hover { background: rgba(255, 255, 255, 0.1); }
            
            .btn-cancel { font-size: 0.85rem; font-weight: 600; color: #ef4444; background: rgba(239, 68, 68, 0.05); padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.1); cursor: pointer; }
            .system-link { display: flex; align-items: center; gap: 8px; color: var(--accent); font-weight: 600; text-decoration: none; font-size: 0.9rem; }
            .status-item { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); }
            .status-dot.active::before { content: ''; width: 6px; height: 6px; background: #4ade80; border-radius: 50%; display: inline-block; margin-right: 8px; box-shadow: 0 0 8px #4ade80; }
            .btn-crm { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 12px; color: var(--text); font-weight: 600; cursor: pointer; background: rgba(255,255,255,0.02); font-size: 0.9rem; }
            .history-table th { text-align: left; font-size: 0.75rem; color: var(--text-muted); padding: 12px; border-bottom: 1px solid var(--border); }
            .history-table td { padding: 16px 12px; font-size: 0.9rem; border-bottom: 1px solid var(--border); color: var(--text-secondary); }
            .status-text { color: #4ade80; font-weight: 600; }
            .btn-download { color: #fff; background: none; border: none; cursor: pointer; padding: 8px; opacity: 0.7; transition: opacity 0.2s; }
            .btn-download:hover { opacity: 1; }

            /* Linked Card Design Improved (Glassmorphism) */
            .linked-card-premium { background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 24px; box-shadow: inset 0 1px 1px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px); }
            .linked-card-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
            .linked-card-chip { width: 36px; height: 26px; background: linear-gradient(135deg, #d4af37 0%, #f9d71c 100%); border-radius: 6px; opacity: 0.9; box-shadow: inset 0 1px 2px rgba(255,255,255,0.5); }
            .linked-card-number { font-family: var(--font-mono); font-size: 1.15rem; color: #fff; letter-spacing: 0.12em; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
            .linked-card-label { font-size: 0.65rem; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em; }
            .linked-card-val { font-size: 0.9rem; color: #fff; font-family: var(--font-mono); font-weight: 500; }

            /* Add Card styles */
            .add-card-view { max-width: 900px; margin: 0 auto; padding-top: 20px; }
            .add-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
            .card-3d-body { width: 100%; height: 230px; background: linear-gradient(135deg, #222 0%, #000 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 28px; box-shadow: 0 40px 80px rgba(0,0,0,0.6); transition: transform 0.1s ease-out; position: relative; }
            .card-inner-content { transform: translateZ(50px); }
            .card-chip { width: 44px; height: 32px; background: linear-gradient(135deg, #d4af37 0%, #f9d71c 100%); border-radius: 6px; opacity: 0.8; box-shadow: inset 0 1px 2px rgba(255,255,255,0.5); }
            /* Tamaño de fuente ajustado a 1.1rem para que quepa en una línea */
            .card-number-display { font-family: var(--font-mono); font-size: 1.1rem; letter-spacing: 0.1em; color: #fff; white-space: nowrap; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
            .card-label { font-size: 0.6rem; text-transform: uppercase; color: rgba(255,255,255,0.4); }
            .card-value { font-family: var(--font-mono); font-size: 0.9rem; color: #fff; }
            
            .card-form { display: flex; flex-direction: column; gap: 20px; }
            .form-group label { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; display: block; }
            .form-group input { background: #1a1a1a; border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; color: #fff; width: 100%; transition: border 0.2s; }
            .form-group input:focus { border-color: var(--accent); outline: none; }
            .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            
            .btn-save-card { background: #fff; color: #000; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; display: flex; justify-content: center; align-items: center; transition: opacity 0.2s; }
            .btn-save-card:hover:not(:disabled) { opacity: 0.9; }
            
            .btn-cancel-card { background: transparent; color: var(--text); padding: 14px; border-radius: 12px; font-weight: 600; font-size: 0.95rem; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; }
            .btn-cancel-card:hover:not(:disabled) { background: rgba(255,255,255,0.05); }

            @media (max-width: 1100px) { .account-grid { grid-template-columns: 1fr 1fr; } .add-card-grid { grid-template-columns: 1fr; gap: 40px; } }
            @media (max-width: 768px) { .account-grid { grid-template-columns: 1fr; } .account-modal-content { padding: 24px; } .account-card { padding: 30px 24px; } .detail-item { flex-direction: column; align-items: flex-start; gap: 4px; } .actions-row { margin-top: 40px; } }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
