'use client'

import Image from 'next/image'
import React from 'react'
import StakingModal from '../../app/StakingModal'

export default function Header() {
  return (
    <>
      <style jsx>{`
          @keyframes move {
            0% { transform: translateX(0); }
            50% { transform: translateX(10px); }
            100% { transform: translateX(0); }
          }
           @keyframes shine {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
          .animated {
            animation: shine 8s infinite;
          }
          .animated2 {
            animation: shine 4s infinite;
            animation-delay: 2s;
          }
        `}
      </style>
      <section id='header' className="overflow-hidden header relative flex w-full flex-col items-center justify-center gap-4" style={{ height: "calc(100vh - 150px)" }}>
        <div className="absolute inset-0 z-0 animated pointer-events-none ">
          <Image src="/images/capa1.svg" alt="texture" height={1920} width={1080} />
        </div>
        <div className="absolute inset-0 z-0 rotate-180 right-0 animated2 pointer-events-none">
          <Image src="/images/capa1.svg" alt="texture" height={1920} width={1080} />
        </div>
        <div className="absolute -right-20 -top-40 flex items-center justify-center">
          <div className="w-1/3 h-1/3 blur-3xl absolute z-20 bg-brand-bg rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-4 lg:mx-0 backdrop-blur-lg relative z-40 text-center bg-transparent rounded-lg shadow-lg border border-0.5 border-gray-300 dark:border-gray-800 border-opacity-30 p-[1.25rem]">
          <h1 className="">SUPERTEAM <span className='gradientText'>GERMANY</span> X STAKING <span className='gradientText'>FACILITIES</span> VALIDATOR</h1>
        </div>
        <p className='max-w-2xl text-center  opacity-60 mt-4 backdrop-blur-sm'>Staking is the easiest and safest way to be rewarded for securing the Solana network. Staking with our validator directly funds Public Good projects on Solana through our <a href='#' target='_blank' className='underline tooltip tooltip-info' data-tip='Link to the Grants Program'>grant program</a>.</p>
        <StakingModal />
      </section>
    </>
  )
}

