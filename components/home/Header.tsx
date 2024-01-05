import React from 'react'

export default function Header() {
  return (
    <section id='header' className="header relative flex w-full flex-col items-center justify-center" style={{ height: "calc(100vh - 150px)" }}>
      <div className="absolute inset-0 z-0">
        <img src="/images/capa1.svg" alt="" height={1920} width={1080} />
      </div>
      <div className="absolute inset-0 z-0 rotate-180">
        <img src="/images/capa1.svg" alt="" height={1920} width={1080} />
      </div>
      {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/3 h-1/3 blur-3xl absolute z-20 bg-black rounded-full"></div>
        </div> */}
      <div className="max-w-6xl backdrop-blur-lg relative z-40 text-center bg-transparent rounded-lg shadow-lg border border-0.5 border-gray-300 dark:border-gray-800 border-opacity-30 p-[1.25rem]">
        <h1 className="">SUPERTEAM <span className='gradientText'>GERMANY</span> X STAKING <span className='gradientText'>FACILITIES</span> VALIDATOR</h1>
      </div>
      <p className='max-w-3xl text-center text-2xl opacity-60 mt-4 backdrop-blur-sm'>Staking is the easiest and safest method for someone to help secure the network and earn passive income in the crypto space.</p>
    </section>
  )
}

