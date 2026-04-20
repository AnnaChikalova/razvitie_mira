import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import FacebookPixelTracker from './components/FacebookPixel'

// Lazy load страницы для code splitting
const Home = lazy(() => import('./pages/Home'))
const CoursePage = lazy(() => import('./pages/Course'))
const NewEpochCoursePage = lazy(() => import('./pages/NewEpochCourse'))
const JoinCourse = lazy(() => import('./pages/JoinCourse'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'))
const PublicOffer = lazy(() => import('./pages/PublicOffer'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))

// Base path только для production (GitHub Pages)
const basename = import.meta.env.PROD ? '/dukhovnoye_razvitiye' : ''

// Компонент загрузки
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#e8e4dc'
  }}>
    <div style={{ color: '#475569' }}>Загрузка...</div>
  </div>
)

export default function App() {
  // Отключаем автоматическое восстановление позиции прокрутки
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  return (
    <BrowserRouter basename={basename}>
      <FacebookPixelTracker />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:slug" element={<CoursePage />} />
          <Route path="/courses/new-epoch" element={<NewEpochCoursePage />} />
          <Route path="/join-course" element={<JoinCourse />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/public-offer" element={<PublicOffer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
