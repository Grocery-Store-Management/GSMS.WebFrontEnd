import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './assets/css/tailwind.output.css'
import App from './App'
import { SidebarProvider } from './context/SidebarContext'
import ThemedSuspense from './components/ThemedSuspense'
import { Windmill } from '@windmill/react-ui'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <Suspense fallback={<ThemedSuspense />}>
    <SidebarProvider>
      <Windmill usePreferences>
        <App />
      </Windmill>
    </SidebarProvider>
  </Suspense>
  ,
  document.getElementById('root')
)

