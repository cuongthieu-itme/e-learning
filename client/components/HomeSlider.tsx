"use client";

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomeSlider = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const swiperRef = useRef<any>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);

  const sliderData = [
    {
      id: 1,
      title: 'Khám phá các khóa học phù hợp với phong cách của bạn',
      description: 'E-Learning là nền tảng cung cấp đa dạng khóa học, thích ứng với nhiều phong cách và sở thích khác nhau.',
      bgColor: 'bg-gradient-to-br from-[#0c39b3] via-[#02fcfc8c] to-indigo-700',
    },
    {
      id: 2,
      title: 'Học hỏi từ chuyên gia hàng đầu trong ngành',
      description: 'Tiếp cận nội dung chất lượng cao được tạo ra bởi những người có nhiều năm kinh nghiệm trong lĩnh vực.',
      bgColor: 'bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600',
    },
    {
      id: 3,
      title: 'Tự do học tập theo nhịp độ riêng của bạn',
      description: 'Truy cập khóa học mọi lúc, mọi nơi. Học tập khi phù hợp với lịch trình của bạn.',
      bgColor: 'bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600',
    },
  ];

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-lg">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        speed={500}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setTimeout(() => {
            if (swiper.params && swiper.params.navigation) {
              const nav = swiper.params.navigation as any;
              nav.prevEl = navigationPrevRef.current;
              nav.nextEl = navigationNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
              setIsInitialized(true);
            }
          }, 10);
        }}
        className="h-full w-full"
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative h-full w-full ${slide.bgColor}`}>
              <div className="flex h-full w-full flex-col justify-center p-8">
                <h1 className="max-w-2xl text-3xl font-bold text-white md:text-4xl will-change-transform">
                  {slide.title}
                </h1>
                <div className="mt-4 max-w-lg">
                  <p className="text-white/90 md:text-lg">
                    {slide.description}
                  </p>
                </div>
                <div className="mt-6">
                  <button className="rounded-full bg-white px-6 py-2 font-semibold text-indigo-700 transition-colors hover:bg-opacity-90 hover:shadow-lg">
                    Khám phá khóa học
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2">
        <button
          ref={navigationPrevRef}
          className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 will-change-transform"
          aria-label="Previous slide"
          disabled={!isInitialized}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          ref={navigationNextRef}
          className="flex h-10 w-10 transform items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 will-change-transform"
          aria-label="Next slide"
          disabled={!isInitialized}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HomeSlider;
