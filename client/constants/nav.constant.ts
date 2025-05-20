import {
  AlignVerticalJustifyEnd,
  Book,
  Heart,
  Home,
  LayoutDashboard,
  Plus,
  ShoppingBag,
  User,
  View
} from 'lucide-react';

export const UserNavbarActions = [
  {
    id: 1,
    icon: Heart,
    text: 'Wishlist',
    href: '/wishlist',
  },
  {
    id: 2,
    icon: ShoppingBag,
    text: 'Cart',
    href: '/cart',
  },
  {
    id: 3,
    icon: User,
    text: 'Profile',
    href: '/profile',
  },
];

export const AdminNavbarActions = [
  {
    id: 1,
    icon: Home,
    text: 'Trang chủ',
    href: '/',
    subActions: [],
  },
  {
    id: 2,
    icon: LayoutDashboard,
    text: 'Tổng quan',
    href: '/dashboard',
    subActions: [],
  },
  {
    id: 3,
    icon: User,
    text: 'Người dùng',
    href: '/users',
    subActions: [
      {
        id: 3.1,
        icon: View,
        text: 'Danh sách',
        href: '/dashboard/users',
      },
    ],
  },
  {
    id: 4,
    icon: ShoppingBag,
    text: 'Sản phẩm',
    href: '/dashboard/products',
    subActions: [
      {
        id: 4.1,
        icon: Plus,
        text: 'Add Product',
        href: '/dashboard/products/add',
      },
      {
        id: 4.2,
        icon: View,
        text: 'View Products',
        href: '/dashboard/products',
      },
    ],
  },
  {
    id: 5,
    icon: Book,
    text: 'Khóa học',
    href: '/dashboard/courses',
    subActions: [
      {
        id: 5.1,
        icon: Plus,
        text: 'Thêm khóa học',
        href: '/dashboard/courses/add',
      },
      {
        id: 5.2,
        icon: View,
        text: 'Danh sách khóa học',
        href: '/dashboard/courses',
      },
    ],
  },
  {
    id: 6,
    icon: AlignVerticalJustifyEnd,
    text: 'Chủ đề khóa học',
    href: '/dashboard/course-topics',
    subActions: [
      {
        id: 6.1,
        icon: Plus,
        text: 'Tạo mới',
        href: '/dashboard/course-topics/add',
      },
      {
        id: 6.2,
        icon: View,
        text: 'Danh sách',
        href: '/dashboard/course-topics',
      },
    ],
  },
  // {
  //   id: 6,
  //   icon: Settings,
  //   text: 'Settings',
  //   href: '/dashboard/settings',
  //   subActions: [],
  // },
];
