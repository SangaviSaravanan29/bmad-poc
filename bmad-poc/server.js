import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Enable CORS
app.use(cors())

// Serve static files from the dist directory (after build)
app.use(express.static(path.join(__dirname, 'dist')))

// API routes can be added here
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running' })
})

// Serve the frontend application for all routes (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Frontend available at http://localhost:${PORT}`)
  console.log(`API health check: http://localhost:${PORT}/api/health`)
})
