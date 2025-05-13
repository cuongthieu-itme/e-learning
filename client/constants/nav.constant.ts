import {
  ClipboardList,
  Heart,
  Home,
  LayoutDashboard,
  Plus,
  ShoppingBag,
  TicketCheck,
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
    icon: ClipboardList,
    text: 'Đơn hàng',
    href: '/dashboard/orders',
    subActions: [],
  },
  {
    id: 6,
    icon: TicketCheck,
    text: 'Coupons',
    href: '/dashboard/coupons',
    subActions: [
      {
        id: 6.1,
        icon: Plus,
        text: 'Create Coupon',
        href: '/dashboard/coupons/create',
      },
      {
        id: 6.2,
        icon: View,
        text: 'View Coupons',
        href: '/dashboard/coupons/',
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
