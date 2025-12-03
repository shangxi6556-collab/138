// frontend/src/components/CountdownTimer.tsx
import { useState, useEffect } from 'react'

export default function CountdownTimer() {
  // 计算距离下一个整点还有多少秒
  const calculateTimeLeft = () => {
    const now = new Date()
    const nextHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1, // 下一个整点
      0,
      0,
      0
    )
    const difference = nextHour.getTime() - now.getTime()

    if (difference <= 0) return { minutes: 0, seconds: 0 }

    const minutes = Math.floor(difference / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return { minutes, seconds }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      margin: '40px 0',
      padding: '20px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255,255,255,0.3)',
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '2rem' }}>
        距离下次开抢
      </h2>
      
      <div style={{
        fontSize: '4.5rem',
        fontWeight: 'bold',
        letterSpacing: '8px',
        color: '#fff',
        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>

      <p style={{ margin: '20px 0 0 0', fontSize: '1.5rem', opacity: 0.9 }}>
        每小时整点准时开抢！快叫朋友一起来！
      </p>
    </div>
  )
}