'use client';

import QueryParamController from '@/components/shared/QueryParamController';
import { Input } from '@/components/ui/form/input';
import { SelectWrapper } from '@/components/ui/form/select';
import { SORT_OPTIONS } from '@/constants';

const SearchDashboardCourses: React.FC = () => {
  return (
    <div className="flex items-center gap-5 max-lg:flex-col max-lg:items-start">
      <div className="flex-1 basis-7/12 max-lg:w-full max-lg:basis-full">
        <QueryParamController<string>
          paramKey="search"
          transform={{
            decode: (value: string | string[]) =>
              Array.isArray(value) ? value[0] || '' : value || '',
            encode: (value) => value,
          }}
        >
          {({ value, onChange }) => (
            <Input
              type="text"
              placeholder="Tìm kiếm khóa học...."
              value={value !== undefined ? value : ''}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </QueryParamController>
      </div>

      <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
        <QueryParamController<string>
          paramKey="limit"
          transform={{
            decode: (value: string | string[]) =>
              Array.isArray(value) ? value[0] || '' : value || '',
            encode: (value) => value,
          }}
        >
          {({ value, onChange }) => (
            <SelectWrapper
              className="w-full"
              value={value}
              onChange={onChange}
              placeholder="Số lượng dữ liệu/trang"
              groups={[
                {
                  label: 'Số lượng dữ liệu/trang',
                  options: [
                    {
                      label: '10',
                      value: '10',
                    },
                    {
                      label: '25',
                      value: '25',
                    },
                    {
                      label: '50',
                      value: '50',
                    },
                  ],
                },
              ]}
            />
          )}
        </QueryParamController>
      </div>

      <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
        <QueryParamController<string>
          paramKey="sort"
          transform={{
            decode: (value: string | string[]) =>
              Array.isArray(value) ? value[0] || '' : value || '',
            encode: (value) => value,
          }}
        >
          {({ value, onChange }) => (
            <SelectWrapper
              className="w-full"
              value={value}
              onChange={onChange}
              placeholder="Sắp xếp"
              groups={[
                {
                  label: 'Sắp xếp',
                  options: SORT_OPTIONS,
                },
              ]}
            />
          )}
        </QueryParamController>
      </div>
    </div>
  );
};

export default SearchDashboardCourses;
