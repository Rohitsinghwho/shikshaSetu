// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContexts.jsx'

createRoot(document.getElementById('root')).render(
    <App />
    
)
