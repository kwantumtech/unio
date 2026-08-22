import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const page = window.location.pathname.replace(/\/+$/, '') || '/'
// The full experience is now live at the root. Keep the Coming Soon page
// available at its own route for staging or future campaign use.
const Page = (await (page === '/coming-soon' ? import('./ComingSoon.jsx') : import('./App.jsx'))).default

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page heroMode={page === '/preview' ? 'video' : 'still'} />
  </StrictMode>,
)
