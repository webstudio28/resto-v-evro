import { unlink, readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

// Remove service worker files from dist folder for native builds
async function removeSWFiles() {
  const distDir = 'dist'
  
  const filesToRemove = [
    'sw.js',
    'registerSW.js',
  ]
  
  // Remove workbox files (they have hash in name)
  try {
    const files = await readdir(distDir)
    const workboxFiles = files.filter(file => file.startsWith('workbox-') && file.endsWith('.js'))
    filesToRemove.push(...workboxFiles)
  } catch (err) {
    console.error('Error reading dist directory:', err)
  }
  
  // Remove each file
  for (const file of filesToRemove) {
    try {
      const filePath = join(distDir, file)
      await unlink(filePath)
      console.log(`✅ Removed: ${file}`)
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`Error removing ${file}:`, err.message)
      }
    }
  }
  
  // Remove service worker script reference and external scripts from index.html
  try {
    const htmlPath = join(distDir, 'index.html')
    let html = await readFile(htmlPath, 'utf-8')
    
    // Remove the registerSW script tag
    html = html.replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/g, '')
    
    // Remove external analytics scripts (goatcounter)
    html = html.replace(/<script[^>]*goatcounter[^>]*><\/script>/gi, '')
    html = html.replace(/<script[^>]*gc\.zgo\.at[^>]*><\/script>/gi, '')
    
    await writeFile(htmlPath, html, 'utf-8')
    console.log('✅ Cleaned up index.html (removed SW and external scripts)')
  } catch (err) {
    console.error('Error updating index.html:', err.message)
  }
}

removeSWFiles().catch(console.error)

