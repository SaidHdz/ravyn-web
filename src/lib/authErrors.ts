export function translateAuthError(err: unknown): string {
  const raw = (err instanceof Error ? err.message : String(err ?? '')).toLowerCase()

  if (!raw) return 'Ocurrió un error inesperado. Intenta de nuevo.'

  if (raw.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (raw.includes('user already registered') || raw.includes('already exists')) return 'Ya existe una cuenta con este correo.'
  if (raw.includes('email not confirmed')) return 'Aún no confirmas tu correo. Revisa tu bandeja de entrada.'
  if (raw.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (raw.includes('invalid email') || raw.includes('unable to validate email')) return 'El formato del correo no es válido.'
  if (raw.includes('email rate limit') || raw.includes('over_email_send_rate_limit')) return 'Demasiados intentos. Espera unos minutos.'
  if (raw.includes('for security purposes') || raw.includes('only request this')) return 'Espera unos segundos antes de volver a intentar.'
  if (raw.includes('user not found')) return 'No encontramos una cuenta con este correo.'
  if (raw.includes('network') || raw.includes('failed to fetch') || raw.includes('fetch failed')) return 'Sin conexión. Verifica tu internet e intenta de nuevo.'
  if (raw.includes('weak password')) return 'La contraseña es demasiado débil.'

  return 'Algo salió mal. Intenta de nuevo en unos segundos.'
}
