'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'

function Stats() {
  const wallet = useWallet()

  return (
    <>
      {
        wallet.connected ? <div className="w-full flex flex-col items-center justify-center p-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-md border border-white border-opacity-50">
          <p className='mb-4'>Rewards</p>
          <div className="w-full flex flex-row items-center justify-between gap-2 text-xs p-2">
            <div className="flex flex-row items-center justify-center gap-2">
              <p>Daily:</p>
              <p>0 SOL</p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <p>Weekly:</p>
              <p>0 SOL</p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <p>Monthly:</p>
              <p>0 SOL</p>
            </div>
          </div>
        </div> : null
      }
    </>
  )
}

export default Stats