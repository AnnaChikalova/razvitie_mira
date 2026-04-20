import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { brand, courses } from '../config'
import heroImage from '../assets/sunrise.webp'
import courseHeroImageMobile from '../assets/sun.png'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    { href: '#courses', label: 'Курсы' },
  ]

  // Функция для правильной обработки путей к изображениям с base path
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return ''
    // Если это уже полный URL (http/https), возвращаем как есть
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // В dev-режиме возвращаем путь как есть
    if (import.meta.env.DEV) {
      return imageUrl
    }
    // В production добавляем base path только если его еще нет
    const basePath = '/dukhovnoye_razvitiye'
    if (imageUrl.startsWith(basePath)) {
      return imageUrl
    }
    // Если путь начинается с /assets/, добавляем base path
    if (imageUrl.startsWith('/assets/')) {
      return `${basePath}${imageUrl}`
    }
    // Если путь начинается с /, добавляем base path
    if (imageUrl.startsWith('/')) {
      return `${basePath}${imageUrl}`
    }
    // Для относительных путей
    if (imageUrl.includes('/assets/')) {
      const assetsIndex = imageUrl.indexOf('/assets/')
      const pathAfterAssets = imageUrl.substring(assetsIndex)
      return `${basePath}${pathAfterAssets}`
    }
    // Для других относительных путей
    return `${basePath}/${imageUrl}`
  }

  // Обновление Open Graph изображения для главной страницы
  useEffect(() => {
    const updateMetaImage = () => {
      // Используем getImageUrl для правильной обработки пути
      const relativePath = getImageUrl(heroImage)
      const imageUrl = import.meta.env.PROD
        ? `https://AnnaChikalova.github.io${relativePath}`
        : `${window.location.origin}${relativePath}`

      let ogImage = document.querySelector('meta[property="og:image"]')
      if (!ogImage) {
        ogImage = document.createElement('meta')
        ogImage.setAttribute('property', 'og:image')
        document.head.appendChild(ogImage)
      }
      ogImage.setAttribute('content', imageUrl)
    }
    updateMetaImage()
  }, [])

  return (
    <div className="page">
      <header className="header">
        <a className="logo" href="#hero">
          {brand.logoUrl ? (
            <img className="logo-img" src={brand.logoUrl} alt={brand.name} />
          ) : (
            brand.name
          )}
        </a>
        <nav className="nav">
          {navItems.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <Link to="/courses/mindfulness-101#author">Об авторе</Link>
        </nav>
        <button
          className={`burger${menuOpen ? ' open' : ''}`}
          type="button"
          aria-label="Открыть меню"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link className="cta-link" to="/courses/new-epoch">Присоединиться к курсу</Link>
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <Link to="/courses/mindfulness-101#author" onClick={() => setMenuOpen(false)}>Об авторе</Link>
          <Link className="btn primary" to="/courses/new-epoch" onClick={() => setMenuOpen(false)}>Присоединиться к курсу</Link>
        </div>
      </header>

      <section
        id="hero"
        className="home-hero"
        style={{
          backgroundImage: `linear-gradient(192deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.3) 100%), url(${getImageUrl(heroImage)})`,
        }}
        role="img"
        aria-label="Первый экран"
      >
        <div className="home-hero-content">
          <h1>{brand.tagline}</h1>
          <p>Осознанность, энергетические практики и познание тонкого плана в светлой, бережной атмосфере.</p>
          <div className="hero-actions">
            <a href="#courses" className="btn primary">Смотреть курсы</a>
          </div>
        </div>
      </section>

      <section id="courses" className="section">
        <div className="grid courses" style={{ justifyContent: 'center' }}>
          {courses.filter((c) => c.slug === 'mindfulness-101').map((c) => (
            <article key={c.slug} className="course">
              <div className="course-image" style={{ backgroundImage: `url(${courseHeroImageMobile})` }} aria-label={c.title}></div>
              <div className="course-body">
                <h3>
                  <span className="course-card-kicker">Курс</span>{' '}
                  «{c.title}»
                </h3>
                {c.homeCardBullets && c.homeCardBullets.length > 0 ? (
                  <ul className="course-home-bullets">
                    {c.homeCardBullets.map((line) => (
                      <li key={line}>- {line}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{c.description}</p>
                )}
                <Link to={`/courses/${c.slug}`} className="btn primary small">Открыть курс</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        {(brand.contacts?.email || brand.contacts?.name || brand.contacts?.inn) && (
          <div className="footer-top-contacts">
            <div className="footer-top-left">
              {brand.contacts?.name && (
                <div className="footer-top-name">{brand.contacts.name}</div>
              )}
              {brand.contacts?.inn && (
                <div className="footer-top-inn">{brand.contacts.inn}</div>
              )}
            </div>
            <ul className="footer-top-list">
              {brand.contacts?.email && (
                <li>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <a href={`mailto:${brand.contacts.email}`}>{brand.contacts.email}</a>
                </li>
              )}
            </ul>
            {(brand.legal?.offerUrl || brand.legal?.privacyUrl) && (
              <div className="footer-top-legal">
                {brand.legal?.offerUrl && (
                  <Link to="/public-offer" className="footer-top-legal-link">
                    Договор публичной оферты
                  </Link>
                )}
                {brand.legal?.privacyUrl && (
                  <Link to="/privacy-policy" className="footer-top-legal-link">
                    Политика конфиденциальности
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
        <div className="brand">© {new Date().getFullYear()} {brand.name}</div>
        {import.meta.env.DEV && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/thank-you" style={{ color: '#ffffff', textDecoration: 'underline', fontSize: '14px' }}>Тест: Благодарность</Link>
            <Link to="/payment-failed" style={{ color: '#ffffff', textDecoration: 'underline', fontSize: '14px' }}>Тест: Неуспешная оплата</Link>
          </div>
        )}
      </footer>
    </div>
  )
}





