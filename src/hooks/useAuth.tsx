import React, { createContext, useContext, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  login: (email: string, pass: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session] = useState<Session | null>(null)
  const [loading] = useState(false)

  // Simulación de login con usuario de prueba
  const login = async (email: string, pass: string): Promise<boolean> => {
    if (email === 'test@ravyn.mx' && pass === 'test') {
      setUser({
        id: 'test-user-id',
        email: 'test@ravyn.mx',
        user_metadata: { full_name: 'Usuario Test' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User)
      return true
    }
    return false
  }

  const signOut = async () => {
    setUser(null)
    console.log('Cierre de sesión simulado')
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
