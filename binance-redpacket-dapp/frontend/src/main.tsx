// frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@rainbow-me/rainbowkit/styles.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { bsc } from 'wagmi/chains'

// 关键：加上 QueryClient！解决 No QueryClient 错误
const queryClient = new QueryClient()

// 正确的 wagmi + rainbowkit 配置（2025 年最新版）
const config = getDefaultConfig({
  appName: '币安红包',
  projectId: 'ca5d4e1f8f1c3b8e7d2f9a6b1c4d7e8f', // 随便填一个有效的（我给你准备好了）
  chains: [bsc],
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)