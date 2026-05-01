import React, { useState } from 'react'
import { motion } from 'motion/react'
import SplitText from '../animations/SplitText'
import Magnet from '../animations/Magnet'

const ease = [0.16, 1, 0.3, 1] as const

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'web',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('https://n8n.srv1574981.hstgr.cloud/webhook/contacto-ravyn', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        mode: 'cors',
        body: JSON.stringify(formData)
      });
      
      // n8n a veces responde con 200 pero sin cuerpo, o con texto plano
      if (response.ok || response.status === 200) {
        setStatus('success');
        setFormData({ name: '', email: '', interest: 'web', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        console.error('Respuesta no exitosa:', response.status);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (error) {
      console.error('Error de red o CORS:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contacto" className="section">
      <div className="container">
        <SplitText
          text="Contacto"
          className="section-label"
          delay={50}
          duration={0.8}
          tag="p"
        />
        <div className="contacto-layout">
          <div className="contacto-info-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease }}
            >
              <div className="flex flex-col items-start mb-6">
                <SplitText
                  text="¿Tienes un"
                  className="contacto-heading"
                  delay={40}
                  duration={0.6}
                  tag="h2"
                  textAlign="left"
                  splitType="words"
                />
                <SplitText
                  text="proyecto?"
                  className="contacto-heading"
                  delay={40}
                  duration={0.6}
                  tag="h2"
                  textAlign="left"
                  splitType="words"
                />
              </div>
              <p className="contacto-sub mb-12">
                Cuéntanos qué quieres construir o lo que necesitas resolver. Respondemos en menos de 24 horas.
              </p>
            </motion.div>

            <motion.div
              className="contacto-options"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease, delay: 0.15 }}
            >
              <Magnet distance={0.15} stiffness={160} damping={15}>
                <a className="contact-option" href="https://wa.me/528361168007" target="_blank" rel="noopener noreferrer">
                  <div className="contact-option-body">
                    <p className="contact-option-label">WhatsApp</p>
                    <p className="contact-option-value">+52 836 116 8007</p>
                  </div>
                  <span className="contact-option-arrow">→</span>
                </a>
              </Magnet>
              
              <Magnet distance={0.15} stiffness={160} damping={15}>
                <a className="contact-option" href="mailto:contacto@ravynstudio.mx">
                  <div className="contact-option-body">
                    <p className="contact-option-label">Email</p>
                    <p className="contact-option-value">contacto@ravynstudio.mx</p>
                  </div>
                  <span className="contact-option-arrow">→</span>
                </a>
              </Magnet>
            </motion.div>
          </div>

          <motion.div 
            className="contacto-form-col"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="Tu nombre" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input" 
                  placeholder="tu@email.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interés</label>
                <select 
                  name="interest"
                  className="form-input appearance-none" 
                  style={{ cursor: 'pointer' }}
                  value={formData.interest}
                  onChange={handleChange}
                >
                  <option value="web">Desarrollo Web / App</option>
                  <option value="iot">Soluciones IoT</option>
                  <option value="automation">Automatización / n8n</option>
                  <option value="other">Otro Proyecto</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mensaje</label>
                <textarea 
                  name="message"
                  className="form-textarea" 
                  placeholder="¿Cómo podemos ayudarte?" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary form-submit"
                disabled={status === 'loading'}
              >
                <motion.span whileHover={{ x: 3 }} className="flex items-center gap-2">
                  {status === 'loading' ? 'Enviando...' : 
                   status === 'success' ? '¡Mensaje Enviado!' : 
                   status === 'error' ? 'Error al enviar' : 'Enviar Mensaje'} 
                   {status === 'idle' && <span>→</span>}
                </motion.span>
              </button>

              {status === 'success' && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-xs mt-2 text-center font-mono"
                >
                  ¡Recibido! En Ravyn Studio nos ponemos en contacto contigo pronto.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
