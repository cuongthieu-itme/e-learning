import HomeSlider from '@/components/HomeSlider';
import RandomTopics from '@/components/RandomTopics';

const HomePage = () => {
  return (
    <article className="relative">
      <HomeSlider />
      <RandomTopics />
    </article>
  );
};

export default HomePage;
