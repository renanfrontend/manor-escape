import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { ErrorBoundary } from './presentation/components/ErrorBoundary'

const container = document.getElementById('root')
if (!container) throw new Error('Root element "#root" not found')

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <main role="alert" className="grid min-h-dvh place-items-center bg-ink-900 p-6 text-center text-parchment-200">
          <div>
            <p className="mb-4">Algo deu errado na mansão.</p>
            <button type="button" className="rounded-md border border-gold-600 px-4 py-2" onClick={() => { window.location.reload() }}>
              Recarregar
            </button>
          </div>
        </main>
      }
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
