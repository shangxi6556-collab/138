// frontend/src/App.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import CountdownTimer from './components/CountdownTimer'  // ← 新增这行

export default function App() {
  const { address } = useAccount()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff4d4d, #ffb800)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ fontSize: '5rem', margin: '0 0 20px 0' }}>
        币安红包
      </h1>

      {/* 倒计时组件 */}
      <CountdownTimer />

      <p style={{ fontSize: '1.8rem', marginBottom: '40px' }}>
        每小时开抢一次 · 持有 ≥ 20,000币安红包  即可参与
      </p>
     <p style={{ fontSize: '1.8rem', marginBottom: '25px' }}>
      官方唯一推特：@BNBRedPacketBSC

      </p>
       <p style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
        CA:0x00000000000000
      </p>

      <ConnectButton />

      {address && (
        <div style={{ marginTop: '60px' }}>
          <div style={{ fontSize: '8rem' }}>恭喜发财</div>
          <button style={{
            marginTop: '30px',
            padding: '25px 80px',
            fontSize: '3rem',
            background: 'white',
            color: '#d32f2f',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
          }}>
            开抢红包
          </button>
        </div>
      )}
    </div>
  )

}







