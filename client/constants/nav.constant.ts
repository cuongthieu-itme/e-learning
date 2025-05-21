import {
  AlignVerticalJustifyEnd,
  Book,
  Heart,
  Home,
  LayoutDashboard,
  MessageCircleQuestion,
  Plus,
  School,
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
    id: 5,
    icon: Book,
    text: 'Khóa học',
    href: '/dashboard/courses',
    subActions: [
      {
        id: 5.1,
        icon: View,
        text: 'Danh sách',
        href: '/dashboard/courses',
      },
      {
        id: 5.2,
        icon: Plus,
        text: 'Thêm mới',
        href: '/dashboard/courses/add',
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
        icon: View,
        text: 'Danh sách',
        href: '/dashboard/course-topics',
      },
      {
        id: 6.2,
        icon: Plus,
        text: 'Thêm mới',
        href: '/dashboard/course-topics/add',
      },
    ],
  },
  {
    id: 7,
    icon: School,
    text: 'Bài giảng',
    href: '/dashboard/lectures',
    subActions: [
      {
        id: 7.1,
        icon: View,
        text: 'Danh sách',
        href: '/dashboard/lectures',
      },
      {
        id: 7.2,
        icon: Plus,
        text: 'Thêm mới',
        href: '/dashboard/lectures/add',
      },
    ],
  },
  {
    id: 8,
    icon: MessageCircleQuestion,
    text: 'Câu hỏi',
    href: '/dashboard/questions',
    subActions: [
      {
        id: 8.1,
        icon: View,
        text: 'Danh sách',
        href: '/dashboard/questions',
      },
      {
        id: 8.2,
        icon: Plus,
        text: 'Thêm mới',
        href: '/dashboard/questions/add',
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
