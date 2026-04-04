import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// Blindaje de seguridad: Variable de entorno obligatoria
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27' as any, // API estable para producción
});

export const handler: Handler = async (event) => {
  // 1. Validar Método POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // 2. Extraer y validar el cuerpo del request
    const { draft_id, email_cliente, total_mxn, order_id, chosen_slug } = JSON.parse(event.body || '{}');

    if (!draft_id || !total_mxn || !order_id) {
      throw new Error('Faltan datos obligatorios para crear la sesión (draft_id, total, order_id)');
    }

    // 3. Crear Checkout Session de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Puedes añadir 'oxxo' si lo tienes activo en Stripe México
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `Regalo Digital: ${chosen_slug}`,
              description: `Orden: ${order_id} - Experiencia personalizada para ${email_cliente}`,
              images: ['https://ravynstudio.mx/LOGO.png'], // Logo de tu marca (opcional)
            },
            unit_amount: Math.round(total_mxn * 100), // Stripe maneja centavos (entero)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: emailCliente || undefined,
      
      // Metadata crítica para n8n: Estos datos irán en el evento checkout.session.completed
      metadata: {
        draft_id: String(draft_id),
        order_id: String(order_id),
        chosen_slug: String(chosen_slug),
        source: 'ravyn-configurator',
      },

      // URLs de redirección (Netlify proporciona process.env.URL automáticamente)
      success_url: `${process.env.URL || 'https://ravynstudio.mx'}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://ravynstudio.mx'}/configurator`,
      
      // Permitir códigos de descuento (opcional pero profesional)
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    // 4. Devolver el ID de la sesión al frontend para redirigir
    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };

  } catch (err: any) {
    console.error('❌ Error en create-checkout-session:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error interno del servidor' }),
    };
  }
};
