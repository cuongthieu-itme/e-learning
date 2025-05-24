import { BadgeHelp, Truck } from 'lucide-react';

import { renderIconText } from '@/helpers/render-icon-text';

const NavBanner: React.FC = () => {
  const NavBannerIcons = [
    {
      id: 1,
      icon: <BadgeHelp color="#008ECC" />,
      text: 'Hỗ trợ trực tuyến',
    }
  ];

  return (
    <div className="base-padding hide-scrollbar hide-scrollbar flex items-center justify-between gap-5 overflow-x-scroll whitespace-nowrap bg-[#F5F5F5] py-2.5">
      <div>
        <h2 className="font-light text-muted-foreground">
          Chào mừng đến với E-Learning!
        </h2>
      </div>
      <div className="flex items-center gap-10">
        {NavBannerIcons.map((item) => renderIconText(item, { p: 'text-sm' }))}
      </div>
    </div>
  );
};

export default NavBanner;
