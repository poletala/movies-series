import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './store.ts'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}> 
      <PersistGate loading={null} persistor={persistor}>
          <App />
      </PersistGate>
      </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
