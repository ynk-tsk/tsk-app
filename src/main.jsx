import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './i18n/i18n'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'

window.addEventListener('error', (e) => {
  console.error('GlobalError:', e.message, e.error?.stack || e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('UnhandledRejection:', e.reason?.message || e.reason, e.reason?.stack || '')
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
