import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Amplify } from 'aws-amplify'

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_GRAPHQL_URL,
      region: 'us-east-1',
      defaultAuthMode: 'userPool'
    }
  },
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_CLIENT_ID
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_S3_BUCKET,
      region: 'us-east-1'
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)