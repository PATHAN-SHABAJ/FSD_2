import './index.css'
import './App.css'
import { useEffect, useRef, useState } from 'react'

// ─── 3D Star Field Canvas ──────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    let w = window.innerWidth, h = window.innerHeight

    const STAR_COUNT = 280
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w - w / 2,
      y: Math.random() * h - h / 2,
      z: Math.random() * w,
      pz: 0,
    }))

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,2,0.25)'
      ctx.fillRect(0, 0, w, h)

      for (const star of stars) {
        star.pz = star.z
        star.z -= 1.8

        if (star.z <= 0) {
          star.x = Math.random() * w - w / 2
          star.y = Math.random() * h - h / 2
          star.z = w
          star.pz = star.z
        }

        const sx = (star.x / star.z) * w + w / 2
        const sy = (star.y / star.z) * h + h / 2
        const px = (star.x / star.pz) * w + w / 2
        const py = (star.y / star.pz) * h + h / 2
        const size = Math.max(0.3, (1 - star.z / w) * 2.5)
        const opacity = 1 - star.z / w

        ctx.strokeStyle = `rgba(${160 + Math.floor(opacity * 95)}, ${180 + Math.floor(opacity * 75)}, 255, ${opacity})`
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(sx, sy)
        ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" />
}

// ─── Floating 3D Orbit Ring ────────────────────────────────────────────────
function OrbitRing({ radius, color, speed, tilt }: { radius: number; color: string; speed: number; tilt: number }) {
  return (
    <div
      className="orbit-ring"
      style={{
        width: radius * 2,
        height: radius * 2,
        borderColor: color,
        animationDuration: `${speed}s`,
        transform: `rotateX(${tilt}deg) rotateY(0deg)`,
        boxShadow: `0 0 18px 2px ${color}55`,
      }}
    />
  )
}

// ─── Tech Badge ────────────────────────────────────────────────────────────
function TechBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div className="tech-badge" style={{ '--badge-color': color } as React.CSSProperties}>
      <span className="badge-icon">{icon}</span>
      <span className="badge-label">{label}</span>
    </div>
  )
}

// ─── Skill Card ────────────────────────────────────────────────────────────
function SkillCard({ title, items, icon, gradient }: { title: string; items: string[]; icon: string; gradient: string }) {
  return (
    <div className="skill-card" style={{ '--card-gradient': gradient } as React.CSSProperties}>
      <div className="skill-card-header">
        <span className="skill-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <ul className="skill-list">
        {items.map(item => (
          <li key={item}><span className="dot" />  {item}</li>
        ))}
      </ul>
    </div>
  )
}

// ─── Floating Planet ───────────────────────────────────────────────────────
function Planet({ size, color, glow, top, left, animDelay }: {
  size: number; color: string; glow: string; top: string; left: string; animDelay: number
}) {
  return (
    <div
      className="planet"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, #000)`,
        boxShadow: `0 0 ${size * 0.6}px ${size * 0.2}px ${glow}`,
        top, left,
        animationDelay: `${animDelay}s`,
      }}
    />
  )
}

// ─── Main App ──────────────────────────────────────────────────────────────
function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.4 }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const techStack = [
    { icon: '⚛️', label: 'React', color: '#61dafb' },
    { icon: '🔷', label: 'TypeScript', color: '#3178c6' },
    { icon: '💚', label: 'Node.js', color: '#68a063' },
    { icon: '▲', label: 'Next.js', color: '#ffffff' },
    { icon: '🐘', label: 'PostgreSQL', color: '#336791' },
    { icon: '🍃', label: 'MongoDB', color: '#47a248' },
    { icon: '🌐', label: 'GraphQL', color: '#e535ab' },
    { icon: '🐳', label: 'Docker', color: '#2496ed' },
    { icon: '☁️', label: 'AWS', color: '#ff9900' },
    { icon: '🔥', label: 'Redis', color: '#dc382d' },
    { icon: '⚡', label: 'Vite', color: '#a855f7' },
    { icon: '🦀', label: 'Rust', color: '#f74c00' },
  ]

  const skills = [
    {
      title: 'Frontend',
      icon: '🎨',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      items: ['React 19 + Hooks', 'TypeScript', 'Next.js App Router', 'Tailwind CSS', 'Framer Motion', 'Three.js / R3F'],
    },
    {
      title: 'Backend',
      icon: '⚙️',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      items: ['Node.js + Express', 'REST & GraphQL APIs', 'WebSockets', 'Microservices', 'JWT / OAuth 2.0', 'Prisma ORM'],
    },
    {
      title: 'Database & Cloud',
      icon: '🗄️',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      items: ['PostgreSQL', 'MongoDB', 'Redis Cache', 'AWS / GCP', 'Docker + K8s', 'CI/CD Pipelines'],
    },
    {
      title: 'Architecture',
      icon: '🏗️',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      items: ['Clean Architecture', 'DDD Patterns', 'Event-Driven Design', 'CQRS / Event Sourcing', 'API Gateway', 'Monorepo (Turborepo)'],
    },
  ]

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'tech', label: 'Tech' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
  ]

  return (
    <div className="app">
      {/* 3D Star Field */}
      <StarField />

      {/* Ambient Planets */}
      <Planet size={120} color="#6366f1" glow="#6366f155" top="12%" left="8%" animDelay={0} />
      <Planet size={60} color="#06b6d4" glow="#06b6d455" top="65%" left="88%" animDelay={1.5} />
      <Planet size={80} color="#8b5cf6" glow="#8b5cf655" top="80%" left="5%" animDelay={3} />
      <Planet size={40} color="#f59e0b" glow="#f59e0b55" top="30%" left="92%" animDelay={0.7} />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">
          <span className="nav-logo-dot" />
          <span>FSD</span>
        </div>
        <ul className="nav-links">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="nav-cta">Hire Me</a>
      </nav>

      {/* ── HERO ───────────────────────────────────── */}
      <section id="hero" className="hero-section">
        <div className="orbit-system">
          <OrbitRing radius={110} color="#6366f1" speed={8} tilt={70} />
          <OrbitRing radius={155} color="#06b6d4" speed={12} tilt={50} />
          <OrbitRing radius={200} color="#8b5cf6" speed={18} tilt={30} />
          <div className="hero-core">
            <span className="hero-core-label">{'</>'}</span>
          </div>
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">🚀 Full Stack Developer</p>
          <h1 className="hero-title">
            Crafting <span className="gradient-text">Digital</span>
            <br />Universes
          </h1>
          <p className="hero-sub">
            Building scalable, production-ready applications from pixel-perfect
            frontends to robust distributed backends — React · Node.js · TypeScript · AWS
          </p>
          <div className="hero-actions">
            <a href="#skills" className="btn-primary">Explore Skills</a>
            <a href="#about" className="btn-ghost">About Me</a>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ─────────────────────────────── */}
      <section id="tech" className="tech-section">
        <div className="section-header">
          <span className="section-tag">Arsenal</span>
          <h2>Tech <span className="gradient-text">Stack</span></h2>
          <p>Tools and technologies I command daily</p>
        </div>
        <div className="tech-grid">
          {techStack.map(t => <TechBadge key={t.label} {...t} />)}
        </div>
      </section>

      {/* ── SKILLS ─────────────────────────────────── */}
      <section id="skills" className="skills-section">
        <div className="section-header">
          <span className="section-tag">Expertise</span>
          <h2>Core <span className="gradient-text">Skills</span></h2>
          <p>End-to-end capabilities across the full stack</p>
        </div>
        <div className="skills-grid">
          {skills.map(s => <SkillCard key={s.title} {...s} />)}
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────── */}
      <section id="about" className="about-section">
        <div className="about-card">
          <div className="about-visual">
            <div className="about-avatar">
              <span>👨‍💻</span>
            </div>
            <div className="about-stats">
              <div className="stat"><span className="stat-num">5+</span><span className="stat-label">Years Exp</span></div>
              <div className="stat"><span className="stat-num">40+</span><span className="stat-label">Projects</span></div>
              <div className="stat"><span className="stat-num">15+</span><span className="stat-label">Clients</span></div>
            </div>
          </div>
          <div className="about-text">
            <span className="section-tag">About</span>
            <h2>Passionate about <span className="gradient-text">Full Stack</span> Engineering</h2>
            <p>
              I'm a Full Stack Developer who thrives at the intersection of design and engineering.
              I build complete software solutions — from responsive, animated UIs to scalable
              microservice architectures — always with performance, security, and developer experience in mind.
            </p>
            <p>
              My philosophy: <em>clean code, fast delivery, infinite scale.</em> Whether it's a
              real-time collaborative tool, an e-commerce platform, or a data-heavy dashboard,
              I bring every layer to life.
            </p>
            <div className="about-tags">
              {['Open Source', 'System Design', 'API First', 'Agile', 'TDD', 'DevOps'].map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ────────────────────────────── */}
      <section id="contact" className="contact-section">
        <div className="contact-glow" />
        <h2>Ready to <span className="gradient-text">Launch</span>?</h2>
        <p>Let's build something extraordinary together.</p>
        <a href="mailto:hello@dev.io" className="btn-primary btn-large">Get In Touch 🚀</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>Built with ⚛️ React + ⚡ Vite + 🔷 TypeScript</span>
        <span className="footer-dot">·</span>
        <span>3D Space Theme</span>
      </footer>
    </div>
  )
}

export default App
