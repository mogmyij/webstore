import Banner from '@/components/common/Banner';
import Bestsellers from '@/components/homepage/Bestsellers';
import Benefits from '@/components/homepage/Benefits';
import Values from '@/components/homepage/Values';

export default function Home() {
  return (
    <div>
      <Banner />
      <Bestsellers />
      <Benefits />
      <Values />
    </div>
  );
}
