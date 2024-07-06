import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RecoilRoot } from 'recoil'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='489371249303-9pfsdn6l52bo46qtgt79kpk18scdohnf.apps.googleusercontent.com'>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </GoogleOAuthProvider>
)
