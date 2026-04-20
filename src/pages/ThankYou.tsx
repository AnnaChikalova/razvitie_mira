import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import '../App.css'
import { brand } from '../config'
import pic1Image from '../assets/pic1.jpg'
import { trackEvent } from '../utils/facebookPixel'

export default function ThankYou() {
    // Прокрутка к началу страницы при загрузке
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Отслеживание события Purchase для Facebook Pixel
    useEffect(() => {
        trackEvent('Purchase');
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
                    backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.6) 100%), url(${getImageUrl(pic1Image)})`,
                }}
                aria-label="Страница благодарности"
            >
                <div className="course-hero-content">

                    <h1 style={{ margin: '0 0 16px 0', fontSize: '1.5em', color: '#f8fafc' }}>Оплата прошла успешно!</h1>
                    <p style={{ margin: '0 0 32px 0', fontSize: '2.5em', color: '#f8fafc' }}>
                        Благодарим Вас за проявленный интерес.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>

                        <a href="https://t.me/DuhovniyMir_bot?start=gwMm5ECpFMVz3taa" target="_blank" rel="noopener noreferrer" className="btn primary">
                            Перейти к изучению курса
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

