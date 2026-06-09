export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0C2820] border-t border-[rgba(224,67,107,0.35)] pt-8 pb-7">
      <div className="container">

        {/* Main row: logo+tagline left / nav right — centrado en móvil */}
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-between md:gap-8">

          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo-dark.png"
              alt="Ravyn"
              className="h-[24px] w-auto block object-contain flex-shrink-0"
            />
            <span className="font-mono text-[0.6rem] text-[var(--color-muted)] tracking-[0.04em] uppercase">
              De la semilla al producto.
            </span>
          </div>

          {/* Nav + IG — centrado en móvil */}
          <nav className="flex items-center gap-6">
            {[
              { label: 'Studio', href: '/#studio' },
              { label: 'Labs',   href: '/#labs'   },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-sans text-[0.8rem] text-[rgba(250,246,238,0.50)] hover:text-[var(--color-cream)] transition-colors duration-150"
              >
                {label}
              </a>
            ))}
            <a
              href="https://www.instagram.com/ravynstudio/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Ravyn Studio"
              className="text-[rgba(250,246,238,0.50)] hover:text-[var(--color-cream)] transition-colors duration-150"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </nav>
        </div>

        {/* Divider + copyright centrado */}
        <div className="mt-6 pt-5 border-t border-[rgba(250,246,238,0.08)] text-center">
          <span className="font-mono text-[0.7rem] text-[rgba(250,246,238,0.30)] tracking-[0.04em]">
            © {year} Ravyn Studio
          </span>
        </div>

      </div>
    </footer>
  )
}
