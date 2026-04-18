// routes/preview.js — PDF preview in browser (inline disposition; same renderer as download)
import { Router } from 'express'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { renderToBuffer } from '@react-pdf/renderer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { getPDFComponent } = await import(pathToFileURL(path.resolve(__dirname, '../lib/pdf/index.js')).href)

const router = Router()

async function previewPdf(req, res) {
  const start = Date.now()
  try {
    const { resumeData, templateId } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'Missing resumeData' })
    }

    const pdfElement = getPDFComponent(resumeData, templateId ?? 1)
    const buffer     = await renderToBuffer(pdfElement)
    const filename   = `${(resumeData.name || 'resume').replace(/[^a-z0-9]/gi, '_')}.pdf`

    const ms = Date.now() - start
    console.log(`[Preview PDF] template:${templateId ?? 1} | ${(buffer.length / 1024).toFixed(1)} KB | ${(ms / 1000).toFixed(2)}s`)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
    res.setHeader('Content-Length', String(buffer.length))
    res.send(buffer)
  } catch (err) {
    console.error(`[Preview PDF] Error (${((Date.now() - start) / 1000).toFixed(2)}s):`, err.message)
    res.status(500).json({ error: 'PDF preview failed', message: err.message })
  }
}

router.post('/pdf', previewPdf)
router.post('/', previewPdf)

export default router
