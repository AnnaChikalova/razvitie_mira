import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import '../App.css'
import { brand } from '../config'
import pic4Image from '../assets/pic4.jpg'

export default function PaymentFailed() {
    // Прокрутка к началу страницы при загрузке
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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

    return (
        <div className="page">
            <header className="header">
                <Link className="logo" to="/">
                    {brand.logoUrl ? (
                        <img className="logo-img" src={brand.logoUrl} alt={brand.name} />
                    ) : (
                        brand.name
                    )}
                </Link>
                <nav className="nav">
                    <Link to="/">Главная</Link>
                </nav>
            </header>

            <section
                className="course-hero"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.6) 100%), url(${getImageUrl(pic4Image)})`,
                }}
                aria-label="Страница неуспешной оплаты"
            >
                <div className="course-hero-content">

                    <h1 style={{ margin: '0 0 24px 0', fontSize: '2.5em', color: '#f8fafc' }}>К сожалению оплата не прошла...</h1>
                    <p style={{ margin: '0 0 16px 0', fontSize: '1.2em', color: '#f8fafc' }}>
                        Это может быть вызвано несколькими причинами:
                    </p>
                    <ul style={{ margin: '0 auto 24px auto', paddingLeft: '0', fontSize: '1.1em', color: '#f8fafc', listStyleType: 'disc', display: 'inline-block', textAlign: 'left' }}>
                        <li style={{ marginBottom: '8px' }}>отключена онлайн оплата на карте</li>
                        <li style={{ marginBottom: '8px' }}>некорректный ввод данных карты</li>
                        <li style={{ marginBottom: '8px' }}>недостаточно средств на карте</li>
                        <li style={{ marginBottom: '8px' }}>или просто технический сбой</li>
                    </ul>
                    <p style={{ margin: '0 0 32px 0', fontSize: '1.2em', color: '#f8fafc', fontWeight: 'bold' }}>
                        Попробуйте оплатить еще раз
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="https://secure.wayforpay.com/button/b8e033b07dc7f" target="_blank" rel="noopener noreferrer" className="btn primary">
                            Попробовать снова
                        </a>

                    </div>
                </div>
            </section>
        </div>
    )
}

