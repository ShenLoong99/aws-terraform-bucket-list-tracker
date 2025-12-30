import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Amplify } from 'aws-amplify'

// Core Config
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
      loginWith: { email: true }
    }
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_GRAPHQL_URL,
      region: import.meta.env.VITE_REGION,
      defaultAuthMode: 'userPool'
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_S3_BUCKET,
      region: import.meta.env.VITE_REGION,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)