import { useParams, Link } from 'react-router-dom'
import '../App.css'
import { brand, courses } from '../config'
import { useMemo, useState, useEffect } from 'react'
import heroImage from '../assets/sun.png'
import frame5Image from '../assets/frame5.jpg'
import workImage from '../assets/work.webp'
import frame3Image from '../assets/frame3.jpg'
import frame7Image from '../assets/frame7.jpg'

export default function CoursePage() {
  const { slug } = useParams()
  const course = useMemo(() => {
    if (!slug) return undefined
    const found = courses.find((c) => c.slug === slug)
    if (!found) {
      console.log('Course not found. Slug:', slug, 'Available slugs:', courses.map(c => c.slug))
    }
    return found
  }, [slug])
  const [menuOpen, setMenuOpen] = useState(false)


  // Функция для прокрутки к якорю
  const scrollToAnchor = (hash: string) => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          // Добавляем небольшой отступ сверху для фиксированной шапки
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  // Прокрутка к якорю при переходе на курс (только если есть hash в URL)
  useEffect(() => {
    const hash = window.location.hash

    // Если нет hash, устанавливаем позицию в начало только один раз при загрузке
    if (!hash) {
      // Устанавливаем позицию в начало сразу и еще раз через небольшие задержки
      // чтобы перехватить любую автоматическую прокрутку при загрузке
      const setScrollTop = () => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }

      setScrollTop()
      setTimeout(setScrollTop, 0)
      setTimeout(setScrollTop, 50)
      setTimeout(setScrollTop, 100)
      setTimeout(setScrollTop, 200)
      // После этого пользователь может свободно прокручивать страницу
    } else {
      // Если есть hash, прокручиваем к якорю
      setTimeout(() => {
        scrollToAnchor(hash)
      }, 100)
    }
  }, [slug])

  // Обработка изменения hash в URL (например, при использовании кнопки "Назад")
  useEffect(() => {
    const handleHashChange = () => {
      scrollToAnchor(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])


  // Обновление Open Graph изображения для страницы курса
  useEffect(() => {
    if (!course) return

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
  }, [course, slug])

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

  if (!course) {
    return (
      <div className="page section">
        <p>Курс не найден.</p>
        <Link className="btn" to="/">На главную</Link>
      </div>
    )
  }

  function parseAbout(about: string) {
    const lines = about.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    let mode: 'none' | 'if' | 'want' | 'then' | 'notFor' = 'none'
    const ifList: string[] = []
    const wantList: string[] = []
    const rest: string[] = []
    let thenBlock: string | null = null
    const thenText: string[] = []
    let notForBlock: string | null = null
    const notForText: string[] = []

    for (const line of lines) {
      if (/^если\s*вы:?/i.test(line) && !/^если\s*же\s*вы/i.test(line)) { mode = 'if'; continue }
      if (/^(и\s*хотите|и\s*хотели\s*бы|хотели\s*бы):?/i.test(line)) { mode = 'want'; continue }
      if (/^тогда\s*этот\s*курс\s*для\s*вас/i.test(line)) {
        thenBlock = line
        mode = 'then'
        continue
      }
      if (/^если\s*же\s*вы/i.test(line)) {
        mode = 'notFor'
        notForText.push(line)
        continue
      }
      if (/^тогда\s*этот\s*курс\s*(не\s*для\s*вас|скорее\s*всего\s*вам\s*не\s*подойдет)/i.test(line)) {
        notForBlock = line
        mode = 'notFor'
        continue
      }
      if (mode === 'if') {
        const cleanedLine = line.replace(/^[•\-\*]\s*/, '').trim()
        if (cleanedLine) ifList.push(cleanedLine)
        continue
      }
      if (mode === 'want') {
        const cleanedLine = line.replace(/^[•\-\*]\s*/, '').trim()
        if (cleanedLine) wantList.push(cleanedLine)
        continue
      }
      if (mode === 'then') { thenText.push(line); continue }
      if (mode === 'notFor') { notForText.push(line); continue }
      rest.push(line)
    }
    return { ifList, wantList, thenBlock, thenText: thenText.join(' '), notForBlock, notForText: notForText.join(' '), rest }
  }

  const aboutSections = useMemo(() => parseAbout(course.about), [course.about])
  const navItems = [
    { href: '#syllabus', label: 'Программа' },
    ...(course.tariffs ? [{ href: '#tariffs', label: 'Тарифы' }] : []),
    { href: '#about', label: 'О курсе' },
    { href: '#author', label: 'Об авторе' },
    { href: '#faq', label: 'Вопросы' },
  ]

  // Обработка кликов по якорным ссылкам на странице
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        // Добавляем небольшой отступ сверху для фиксированной шапки
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
        // Обновляем URL без перезагрузки страницы
        window.history.pushState(null, '', href)
      }
    }
  }

  return (
    <div className="page">
      <header className="header">
        <Link className="logo" to="/">{brand.logoUrl ? <img className="logo-img" src={brand.logoUrl} alt={brand.name} /> : brand.name}</Link>
        <nav className="nav">
          <Link to="/">Главная</Link>
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} onClick={(e) => handleAnchorClick(e, href)}>{label}</a>
          ))}
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
          <Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link>
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} onClick={(e) => { handleAnchorClick(e, href); setMenuOpen(false); }}>{label}</a>
          ))}
          <Link className="btn primary" to="/courses/new-epoch" onClick={() => setMenuOpen(false)}>Присоединиться к курсу</Link>
        </div>
      </header>

      <section
        className="course-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.25) 0%, rgba(15,23,42,0.45) 100%), url(${getImageUrl(heroImage)})`,
          minHeight: '100vh',
        }}
        aria-label={course.heroBlock?.headline ?? course.title}
      >
        <div className="course-hero-content">
          {course.heroBlock ? (
            <>
              <h1 className="course-hero-headline">{course.heroBlock.headline}</h1>
              <p className="course-hero-tagline">{course.heroBlock.tagline}</p>
              <p className="course-hero-about-intro">{course.heroBlock.aboutIntro}</p>
              <ul className="course-hero-bullets">
                {course.heroBlock.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="course-hero-meta-lines">
                {course.heroBlock.meta.map((line) => (
                  <div key={line} className="muted light">{line}</div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1>{course.title}</h1>
              {course.subtitle && (
                <div className="course-subtitle" style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', lineHeight: '1.02', color: '#ffffff', marginTop: '8px', fontWeight: 400, textTransform: 'none' }}>
                  <span className="course-subtitle-line">путь познания</span>
                  <br className="course-subtitle-break" />
                  <span className="course-subtitle-line course-subtitle-line-second">&nbsp;себя и мира</span>
                </div>
              )}
              <p style={{ marginTop: '24px' }}>
                {course.descriptionPrefix && <span style={{ display: 'block', marginBottom: '4px' }}>{course.descriptionPrefix}</span>}
                {course.description.split(',').map((part, index) => (
                  <span key={index}>
                    {index > 0 && <><br />— {part.trim()}</>}
                    {index === 0 && <>— {part.trim()}</>}
                  </span>
                ))}
              </p>
              {course.durationText && <div className="muted light" style={{ margin: '10px 0 18px 0' }}>{course.durationText}</div>}
            </>
          )}
        </div>
      </section>

      {course.tariffs && course.tariffs.plans.length > 0 && (
        <section id="tariffs" className="section course-tariffs-section" aria-labelledby="course-tariffs-heading">
          <h2 id="course-tariffs-heading">{course.tariffs.heading}</h2>
          <div className="course-tariffs-grid">
            {course.tariffs.plans.map((plan) => (
              <article key={plan.name} className="card course-tariff-card">
                <h3 className="course-tariff-name">{plan.name}</h3>
                {plan.lead && <p className="course-tariff-lead">{plan.lead}</p>}
                <ul className="course-tariff-features">
                  {plan.features.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="about" className="section">
        <h2>Для кого этот курс</h2>
        {(aboutSections.ifList.length > 0 || aboutSections.wantList.length > 0) ? (
          <div className="about-blocks-wrapper">
            {aboutSections.ifList.length > 0 && (
              <div className="about-block-row">
                <div className="card about-block-content-only">
                  <h3><strong>Если вы</strong></h3>
                  <ul className="list">
                    {aboutSections.ifList.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {aboutSections.wantList.length > 0 && (
              <div className="about-block-row">
                <div className="card about-block-content-only">
                  <h3><strong>И хотели бы</strong></h3>
                  <ul className="list">
                    {aboutSections.wantList.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : null}
        {aboutSections.thenBlock && (
          <div className="about-block-row" style={{ justifyContent: 'center' }}>
            <div className="about-block-content-only" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '18px', textAlign: 'center' }}>
              <h3 className="then-block-title" style={{ fontSize: '1.4em' }}><strong>{aboutSections.thenBlock}</strong></h3>
              {aboutSections.thenText && (
                <p style={{ color: '#4D602A', fontSize: '1.1em' }}>{aboutSections.thenText}</p>
              )}
            </div>
          </div>
        )}
        {(aboutSections.notForText || aboutSections.notForBlock) && (
          <div className="about-block-row" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <div className="card" style={{ textAlign: 'center', maxWidth: '800px' }}>
              {aboutSections.notForText && (
                <p style={{ color: '#4D602A', fontSize: '1.1em', marginBottom: '12px' }}>{aboutSections.notForText}</p>
              )}
              {aboutSections.notForBlock && (
                <h3 className="then-block-title" style={{ fontSize: '1.4em' }}><strong>{aboutSections.notForBlock}</strong></h3>
              )}
            </div>
          </div>
        )}
        {course.author && (
          <>
            <h2 id="author" style={{ marginTop: '40px', marginBottom: '20px', textAlign: 'center' }}>Об авторе</h2>
            <div className="card author-card author-card--text-wrap" style={{ marginTop: '20px' }}>
              <div className="author-card-content">
                <div className="author-card-body">
                  {course.author.avatarUrl && (
                    <img
                      className="author-card-avatar"
                      src={course.author.avatarUrl}
                      alt={course.author.name}
                    />
                  )}
                  <h3>{course.author.name}</h3>
                  {course.author.bio.split('\n\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} style={{ marginBottom: '16px' }}>
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        <section
          className="course-hero frame3-section"
          style={{
            minHeight: '450px',
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 100%), url(${getImageUrl(frame3Image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '14px',
            overflow: 'hidden',
            marginTop: '20px',
          }}
          aria-label="Изображение"
        />
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Новая эпоха. Мир "невидимый", что это?!</h3>
          <p style={{ marginBottom: '16px' }}>Мы все слышали такие слова и понятия, как: душа, аура, тонкий план, интуиция, телепатия и разные другие, которые часто используют для определения того, что лежит за пределами восприятия наших привычных органов чувств.</p>
          <p style={{ marginBottom: '16px' }}>Эта тема часто окружена мистикой, таинственностью, а иногда и повышенной секретностью...</p>
          <p style={{ marginBottom: '16px' }}>Хотя на самом деле, подобные явления имеют такие же конкретные характеристики, параметры и свойства, как, например, уже открытое и известное всем электричество или радиоволны. И разница только в том, что они пока еще не измерены и не приняты "официальной" наукой.</p>
          <p style={{ marginBottom: '16px' }}>Например: если бы лет двести назад мы рассказывали людям о существовании вокруг нас каких-то "невидимых радиоволн", то нас бы, мягко говоря, не поняли... А уже сегодня мы воспринимаем их как данность и в порядке вещей, и даже не представляем свою жизнь без них.</p>
          <p style={{ marginBottom: '16px' }}>Поэтому только знание и понимание происходящих процессов отделяет обычные способности человека от его так называемых "сверхспособностей".</p>
          <p style={{ marginBottom: '16px' }}>Поэтому этот курс и был специально создан для того, чтобы в простой и понятной форме показать, как устроена та часть нашего мира, которую мы не воспринимаем нашими физическими органами чувств, но в которой все постоянно находимся и непрерывно взаимодействуем.</p>
          <p style={{ marginBottom: '16px' }}>Мы сейчас переходим в новую эпоху, в которой человечеству будут открываться следующие уровни мира "невидимого", и одновременно восстанавливаться естественные способности человека.</p>
          <p style={{ marginBottom: '16px' }}>Именно об этом и будет данный курс...</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <section
          className="course-hero frame5-section"
          style={{
            minHeight: '450px',
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 100%), url(${getImageUrl(workImage)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '14px',
            overflow: 'hidden',
            marginTop: '20px',
          }}
          aria-label="Изображение"
        />
      </section>
      {aboutSections.rest.length > 0 && (
        <div className="card">
          <p>{aboutSections.rest.join(' ')}</p>
        </div>
      )}
      <div className="course-process-wrapper section" style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        <div className="card course-process" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h3>Как проходит курс</h3>
          <p style={{ marginBottom: '16px' }}>Курс будет проходить в телеграмм канале, доступ к которому вы получите сразу после приобретения курса. А также в телеграмм чате (для тарифа с поддержкой).</p>
          <p style={{ marginBottom: '16px' }}>Старт 1 мая 2026 года.</p>
          <p style={{ marginBottom: '16px' }}>Программа состоит из пяти частей, каждая из которых включает теоретическую часть (видео-урок) с подробными объяснениями и иллюстрациями по заданной теме, и практическую часть для освоения пройденного материала, рассчитанную на 1-2 дня.</p>
          <p style={{ marginBottom: '16px' }}>Доступ ко всем материалам сохраняется в течение 1 года с момента покупки.</p>
        </div>
        <section
          className="course-hero frame4-section"
          style={{
            flex: '1',
            padding: 0,
            minHeight: '450px',
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 100%), url(${getImageUrl(frame5Image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Изображение"
        />
      </div>

      <section id="syllabus" className="section">
        <h2>Программа обучения</h2>
        <div className="grid">
          {course.syllabus.map((m) => (
            <div key={m.title} className="card">
              <h3>{m.title}</h3>
              <ul className="list">
                {m.items.map((it) => (<li key={it}>{it}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        className="course-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.6) 100%), url(${getImageUrl(frame7Image)})`,
        }}
        aria-label="Миссия данного курса"
      >
        <div className="course-hero-content">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.4em', color: '#f8fafc' }}><strong>Миссия данного курса:</strong></h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: '#f8fafc' }}>Наш мир исторически, и астрономически подошёл к тому моменту, когда происходит переход планеты и человечества в новую эпоху.</p>
          <p style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: '#f8fafc' }}>Этот переход будет сопровождаться разного рода планетарными событиями, и в том числе человечеству будут открываться новые уровни мироздания.</p>
          <p style={{ margin: 0, fontSize: '1.1em', color: '#f8fafc' }}>И задача этого курса, дать человеку ориентиры, и поддержать его на этом эволюционном пути.</p>
        </div>
      </section>

      <section id="faq" className="section">
        <h2>Вопросы</h2>
        {course.faqs.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section id="cta" className="section cta">
        <Link
          className="btn primary purchase-btn"
          to="/courses/new-epoch"
        >
          Присоединиться к курсу
        </Link>
      </section>

      <footer className="footer new-epoch-footer">
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


