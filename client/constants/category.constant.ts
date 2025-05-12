import { Category } from '@/types';
import { COLORS, SIZES } from './shared.constant';

const formattedColors = COLORS.map((color) => ({
  label: color
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
  value: color,
}));

const formattedSizes = SIZES.map((size) => ({
  label: size,
  value: size.toLowerCase(),
}));

export const CATEGORY_LIST: Category[] = [
  {
    id: 1,
    name: 'Clothing',
    fields: [],
    subcategories: [
      {
        id: 11,
        parentId: 1,
        name: 'T-Shirts',
        href: '/products/t-shirts',
        fields: [
          {
            name: 'size',
            label: 'Size',
            type: 'multi',
            required: true,
            options: formattedSizes,
            description: 'Choose the appropriate size for the t-shirt.',
          },
          {
            name: 'color',
            label: 'Color',
            type: 'multi',
            required: true,
            options: formattedColors,
            placeholder: 'Select colors',
            description: 'Choose one or more colors for the t-shirt.',
          },
          {
            name: 'fit',
            label: 'Fit',
            type: 'select',
            required: true,
            options: [
              { label: 'Regular', value: 'regular' },
              { label: 'Slim', value: 'slim' },
              { label: 'Oversized', value: 'oversized' },
            ],
            description: 'Choose the appropriate fit for the t-shirt.',
          },
          {
            name: 'material',
            label: 'Material',
            type: 'select',
            required: true,
            options: [
              { label: 'Cotton', value: 'cotton' },
              { label: 'Polyester', value: 'polyester' },
              { label: 'Linen', value: 'linen' },
            ],
            description: 'Choose the material for the t-shirt.',
          },
        ],
      },
      {
        id: 12,
        parentId: 1,
        name: 'Hoodies',
        href: '/products/hoodies',
        fields: [
          {
            name: 'size',
            label: 'Size',
            type: 'multi',
            required: true,
            options: formattedSizes,
            description: 'Choose the appropriate size for the hoodie.',
          },
          {
            name: 'color',
            label: 'Color',
            type: 'multi',
            required: true,
            options: formattedColors,
            description: 'Choose one or more colors for the hoodie.',
          },
          {
            name: 'material',
            label: 'Material',
            type: 'select',
            required: true,
            options: [
              { label: 'Cotton', value: 'cotton' },
              { label: 'Fleece', value: 'fleece' },
              { label: 'Polyester', value: 'polyester' },
            ],
            description: 'Choose the material for the hoodie.',
          },
          {
            name: 'style',
            label: 'Style',
            type: 'select',
            required: true,
            options: [
              { label: 'Pullover', value: 'pullover' },
              { label: 'Zip-Up', value: 'zip-up' },
            ],
            description: 'Choose the style for the hoodie.',
          },
        ],
      },
      {
        id: 13,
        parentId: 1,
        name: 'Jackets',
        href: '/products/jackets',
        fields: [
          {
            name: 'size',
            label: 'Size',
            type: 'multi',
            required: true,
            options: formattedSizes,
            description: 'Choose the appropriate size for the jacket.',
          },
          {
            name: 'color',
            label: 'Color',
            type: 'multi',
            required: true,
            options: formattedColors,
            description: 'Choose one or more colors for the jacket.',
          },
          {
            name: 'material',
            label: 'Material',
            type: 'select',
            required: true,
            options: [
              { label: 'Leather', value: 'leather' },
              { label: 'Cotton', value: 'cotton' },
              { label: 'Polyester', value: 'polyester' },
              { label: 'Denim', value: 'denim' },
            ],
            description: 'Choose the material for the jacket.',
          },
        ],
      },
      {
        id: 14,
        parentId: 1,
        name: 'Tracksuits',
        href: '/products/tracksuits',
        fields: [
          {
            name: 'size',
            label: 'Size',
            type: 'multi',
            required: true,
            options: formattedSizes,
            description: 'Choose the appropriate size for the tracksuit.',
          },
          {
            name: 'color',
            label: 'Color',
            type: 'multi',
            required: true,
            options: formattedColors,
            description: 'Choose one or more colors for the tracksuit.',
          },
        ],
      },
    ],
  },
];
