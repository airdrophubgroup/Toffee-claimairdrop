import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { mainnet, polygon } from 'viem/chains'

// 1. Apni Project ID yahan dalein
const projectId = 'YOUR_PROJECT_ID_HERE'

// 2. Metadata set karein
const metadata = {
  name: 'Toffee Claim',
  description: 'Toffee Reward System',
  url: 'https://toffeeclaimed.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, polygon]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Modal create karein
createWeb3Modal({ wagmiConfig, projectId, chains })

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      {/* Aapka baaki ka code */}
    </WagmiConfig>
  )
}
