import Header from '@/components/common/Header';
import Banner from '@/components/common/Banner';
import Bestsellers from '@/components/homepage/Bestsellers';
import Benefits from '@/components/homepage/Benefits';
import Values from '@/components/homepage/Values';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <Bestsellers />
      <Benefits />
      <Values />
      <Footer />
    </div>
  );
}
