import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// Inicialización de Stripe con la Secret Key de tus variables de entorno
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // Versión estable
});

export const handler: Handler = async (event) => {
  // 1. Solo permitir peticiones POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // 2. Extraer datos del body (Nombres corregidos para coincidir con el Frontend)
    const { draft_id, email, total, order_id, chosen_slug } = JSON.parse(event.body || '{}');

    // 3. Validación técnica de TICs: Si falta algo vital, no seguimos
    if (!draft_id || !total || !order_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: `Faltan datos obligatorios: draft_id=${draft_id}, total=${total}, order_id=${order_id}` 
        }),
      };
    }

    // 4. Crear la sesión de Checkout en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Puedes agregar 'oxxo' después si activas Stripe México
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `Experiencia Ravyn: ${chosen_slug || 'Personalizada'}`,
              description: `Orden ID: ${order_id}`,
              images: ['https://ravynstudio.mx/LOGO.png'], 
            },
            // Stripe requiere el total en centavos (Ej: $50 MXN = 5000)
            unit_amount: Math.round(Number(total) * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined, // Pre-llena el email en la pasarela
      
      // 🛡️ METADATA: Esto es lo que n8n leerá para buscar en Supabase y Cloudinary
      metadata: {
        draft_id: String(draft_id),
        order_id: String(order_id),
        chosen_slug: String(chosen_slug || 'default'),
        source: 'ravyn-configurator',
      },

      // URLs de retorno (Usa process.env.URL en Netlify o localhost en dev)
      success_url: `${process.env.URL || 'http://localhost:8888'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'http://localhost:8888'}/configurator`,
      
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    // 5. Enviar el ID de sesión al frontend para la redirección
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        id: session.id, 
        url: session.url // <--- ESTA LÍNEA ES LA QUE FALTA
      }),
    };

  } catch (err: any) {
    console.error('❌ Error en el backend de Stripe:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error interno en la función de cobro' }),
    };
  }
};