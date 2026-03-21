import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './stores/index.ts'
import { setTokens, fetchProfileRequest } from './stores/slices/auth.slice.ts'

const accessToken = localStorage.getItem('accessToken')
const refreshToken = localStorage.getItem('refreshToken')
if (accessToken && refreshToken) {
  store.dispatch(setTokens({ accessToken, refreshToken }))
  store.dispatch(fetchProfileRequest())
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
