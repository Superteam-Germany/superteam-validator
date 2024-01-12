
import * as React from "react";
import FAQ from '../components/home/FAQ';
import Header from '../components/home/Header';
import About from './About';


const Index: React.FC = async () => {
  return (
    <div className='relative w-full flex flex-col justify-center items-start'>
      <Header />
      {/* <Slider /> */}
      <About />
      <FAQ />
    </div>
  );
};

export default Index;
