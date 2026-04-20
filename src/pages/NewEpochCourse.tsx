import { Link } from 'react-router-dom'
import { brand, newEpochCoursePurchaseUrls } from '../config'
import payImage from '../assets/pay.jpg'
import '../App.css'

type TariffKey = 'basic' | 'support'

const tariffOrder: TariffKey[] = ['basic', 'support']

const tariffContent: Record<TariffKey, { title: string; items: string[] }> = {
  basic: {
    title: 'Базовый',
    items: [
      'Самостоятельное обучение по предоставленным материалам курса',
      'Доступ к программе 1 год',
      'Стоимость 50 €',
    ],
  },
  support: {
    title: 'С поддержкой',
    items: [
      'Всё из тарифа «Базовый»',
      'Чат для участников с поддержкой',
      'Возможность задавать вопросы по теме курса и гарантированно получить ответ в чате группы или лично.',
      'Стоимость 110 €',
    ],
  },
}

export default function NewEpochCoursePage() {
  return (
    <div className="page new-epoch-page">
      <div className="new-epoch-main new-epoch-pay-shell">
        <div
          className="new-epoch-pay-bg-layer"
          style={{ backgroundImage: `url(${payImage})` }}
          aria-hidden
        />
        <div className="new-epoch-pay-frost" aria-hidden />
        <section className="new-epoch-tariffs-hero">
          <div className="new-epoch-glass-panel">
            <h1 className="new-epoch-glass-title">Курс «Новая Эпоха. Способности человека»</h1>

            <section id="tariffs" className="course-tariffs-section new-epoch-tariffs-inner" aria-label="Тарифы">
              <div className="course-tariffs-grid">
                {tariffOrder.map((key) => (
                  <article key={key} className="course-tariff-card course-tariff-card--glass course-tariff-card-with-cta">
                    <h3 className="course-tariff-name">Тариф «{tariffContent[key].title}»</h3>
                    <ul className="course-tariff-features">
                      {tariffContent[key].items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="course-tariff-cta">
                      <a
                        className="btn primary"
                        href={newEpochCoursePurchaseUrls[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Приобрести курс
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <div className="new-epoch-glass-back">
              <Link className="btn new-epoch-back-btn" to="/courses/mindfulness-101">
                Назад к курсу
              </Link>
            </div>
          </div>
        </section>
      </div>

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
