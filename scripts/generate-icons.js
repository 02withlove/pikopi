// Jalankan sekali: node scripts/generate-icons.js
// Butuh: npm install -D sharp

import sharp from 'sharp'
import fs from 'fs'

fs.mkdirSync('public/icons', { recursive: true })

// SVG sederhana dengan warna brand
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="120" fill="#1a0a00"/>
  <text x="256" y="340" font-size="280" text-anchor="middle" fill="#d4a843">☕</text>
</svg>
`

const svgBuffer = Buffer.from(svgIcon)

await sharp(svgBuffer).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(svgBuffer).resize(512, 512).png().toFile('public/icons/icon-512.png')
await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png')

console.log('✅ Icons generated di public/icons/')