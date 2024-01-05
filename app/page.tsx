

const Index: React.FC = async () => {

  return (
    <div className='w-full flex flex-col justify-center items-start'>
      {/* Intro Content */}
      <section className="header relative flex w-full flex-col items-center justify-center" style={{ height: "calc(100vh - 150px)" }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/capa1.svg" alt="" height={1920} width={1080} />
        </div>
        <div className="max-w-3xl relative z-10 text-center bg-transparent rounded-lg shadow-lg border border-0.5 border-gray-300 dark:border-gray-800 p-[1.25rem]">
          <h1 className="">SUPERTEAM <span className='gradientText'>GERMANY</span> X STAKING <span className='gradientText'>FACILITIES</span> VALIDATOR</h1>
        </div>
        <p className='max-w-2xl text-center opacity-40 mt-4'>Staking is the easiest and safest method for someone to help secure the network and earn passive income in the crypto space.</p>
      </section>
      {/* Loop */}
      <section className='w-full flex items-center justify-center slider'>
        <div className="p-2 border-t border-b border-t-white border-b-white w-full flex items-center justify-center">
          <div className="w-full flex flex-row gap-4 items-center justify-around text-6xl font-bold uppercase slide-track">
            <span className='slide'>Solana Community</span>
            <span className='slide'>Art</span>
            <span className='slide'>Events</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
