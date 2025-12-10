import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useEffect, useState } from 'react'

const POOL_ADDRESS = "0x040C8f993A1DeF15C015CDDD22E90239F1080A8F" // 部署后替换
const ABI = [ /* 复制 openRedEnvelope 和 lastOpenTime 的 ABI */ ] as const

export default function RedEnvelopeButton() {
  const { address } = useAccount()
  const [timeLeft, setTimeLeft] = useState(0)

  const { data: lastTime } = useReadContract({
    address: POOL_ADDRESS,
    abi: ABI,
    functionName: 'lastOpenTime'
  })

  const { writeContract } = useWriteContract()

  useEffect(() => {
    if (lastTime) {
      const update = () => {
        const left = 3600 - (Date.now() / 1000 - Number(lastTime))
        setTimeLeft(Math.max(0, left))
      }
      update()
      const timer = setInterval(update, 1000)
      return () => clearInterval(timer)
    }
  }, [lastTime])

  const open = () => {
    writeContract({
      address: POOL_ADDRESS,
      abi: ABI,
      functionName: 'openRedEnvelope',
      args: [[]] // 实际由后端提供 winners
    })
  }

  return timeLeft > 0 ? (
    <div className="text-4xl text-red-600 font-bold">
      {Math.floor(timeLeft / 60)}分{Math.round(timeLeft % 60)}秒 后开抢
    </div>
  ) : (
    <button
      onClick={open}
      className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-20 py-10 rounded-full text-5xl font-bold shadow-2xl hover:scale-110 transition"
    >
      开抢红包
    </button>
  )

}

