import React from 'react'

export default function Slider() {
  return (
    <section id='carousel' className='w-full flex items-center justify-center slider'>
      <div className="p-2 border-t border-b border-t-white border-b-white w-full flex items-center justify-center">
        <div className="w-full flex flex-row gap-4 items-center justify-around text-6xl font-bold uppercase slide-track">
          <span className='slide'>Solana Community</span>
          <span className='slide'>Art</span>
          <span className='slide'>Events</span>
        </div>
      </div>
    </section>
  )
}

