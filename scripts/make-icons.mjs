// Renders src/app/icon.svg into src/app/favicon.ico (PNG-in-ICO) and src/app/apple-icon.png.
import { readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const svg = await readFile('src/app/icon.svg')
const png48 = await sharp(svg, { density: 384 }).resize(48, 48).png().toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // one image
header.writeUInt8(48, 6) // width
header.writeUInt8(48, 7) // height
header.writeUInt8(0, 8) // palette
header.writeUInt8(0, 9) // reserved
header.writeUInt16LE(1, 10) // colour planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(png48.length, 14) // image size
header.writeUInt32LE(22, 18) // offset
await writeFile('src/app/favicon.ico', Buffer.concat([header, png48]))

// Apple touch icon: a full square (iOS rounds the corners itself).
const square = Buffer.from(
  svg.toString().replace('<circle cx="32" cy="32" r="32" fill="#722A1E"/>', '<rect width="64" height="64" fill="#722A1E"/>'),
)
await sharp(square, { density: 768 }).resize(180, 180).png().toFile('src/app/apple-icon.png')
console.log('icons written')
