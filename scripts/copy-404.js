import { copyFileSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const distPath = join(process.cwd(), 'dist')
const indexPath = join(distPath, 'index.html')
const notFoundPath = join(distPath, '404.html')
const basePath = '/dukhovnoye_razvitiye'

try {
    // Читаем index.html
    let html = readFileSync(indexPath, 'utf-8')

    // Исправляем пути к ресурсам (добавляем base path)
    html = html.replace(/href="\/(assets|vite\.svg)/g, `href="${basePath}/$1`)
    html = html.replace(/src="\/(assets|vite\.svg)/g, `src="${basePath}/$1`)

    // Сохраняем исправленный index.html
    writeFileSync(indexPath, html, 'utf-8')

    // Копируем в 404.html
    copyFileSync(indexPath, notFoundPath)

    console.log('✓ Fixed paths in index.html and created 404.html for GitHub Pages')
} catch (error) {
    console.error('Error processing files:', error)
    process.exit(1)
}

