import HomeSlider from '@/components/HomeSlider';
import RandomCourses from '@/components/RandomCourses';

const HomePage = () => {
  return (
    <article className="relative">
      <HomeSlider />
      {/* <RandomTopics /> */}
      <RandomCourses />
    </article>
  );
};

export default HomePage;
