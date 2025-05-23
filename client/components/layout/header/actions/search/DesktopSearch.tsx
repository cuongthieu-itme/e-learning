import { useMounted } from '@/hooks/core/useMounted.hook';

import { SearchInput } from './SearchInput';

import {
  Popover,
  PopoverTrigger
} from '@/components/ui/layout/popover';

export const DesktopSearch: React.FC = ({ }) => {
  const { isMounted } = useMounted();
  if (!isMounted) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <SearchInput />
        </div>
      </PopoverTrigger>
    </Popover>
  );
};
