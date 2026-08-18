import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const page = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = (await (page === '/preview' ? import('./Preview.jsx') : import('./ComingSoon.jsx'))).default

createRoot(document.getElementById('root')).render(<StrictMode><Page /></StrictMode>)
