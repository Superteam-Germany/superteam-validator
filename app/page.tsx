import FAQ from '../components/home/FAQ';
import Header from '../components/home/Header';
import Slider from '../components/home/Slider';


const Index: React.FC = async () => {

  return (
    <div className='w-full flex flex-col justify-center items-start'>
      <Header />
      <Slider />


      <section className='w-full my-32'>
        <div className="container mx-auto flex flex-row items-center justify-center gap-8">
          <div className="w-full flex flex-row items-center justify-center backdrop-blur-lg relative z-40 bg-transparent rounded-lg shadow-lg border border-0.5 border-gray-300 dark:border-gray-800 border-opacity-30 p-4 py-16 text-start">
            <div className="w-1/2">  <h1 className='text-4xl font-bold text-start'>Calculate your rewards</h1>
              <p className='text-xl text-start mt-4 max-w-3xl'>Solana is a fast, secure, and censorship resistant blockchain providing the open infrastructure required for global adoption.</p></div>
            <div className="w-1/2">  <h1 className='text-4xl font-bold text-start'>Your Account</h1>
              <p className='text-xl text-start mt-4 max-w-3xl'>Solana is a fast, secure, and censorship resistant blockchain providing the open infrastructure required for global adoption.</p></div>
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
};

export default Index;
