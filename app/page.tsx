
import * as React from "react";
import FAQ from '../components/home/FAQ';
import Header from '../components/home/Header';
import About from './About';


const Index: React.FC = async () => {
  return (
    <div className='relative w-full flex flex-col justify-start items-start px-2 lg:px-0'>
      <Header />
      {/* <Slider /> */}
      <About />
      <FAQ />
    </div>
  );
};

export default Index;
