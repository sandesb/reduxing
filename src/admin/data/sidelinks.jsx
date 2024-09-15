import {
  AppWindowIcon,
  CheckSquare,
  Hexagon,
  LayoutDashboard,
  Settings,
  Shield,
} from 'lucide-react';

export const sidelinks = [
  {
    title: 'Dashboard',
    label: '',
    to: '/admin/dashboard', // Use "to" instead of "href"
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: 'Tasks',
    label: '3',
    to: 'tasks', // Use "to" instead of "href"
    icon: <CheckSquare size={18} />,
  },
  {
    title: 'Apps',
    label: '',
    to: '/admin/apps', // Use "to" instead of "href"
    icon: <AppWindowIcon size={18} />,
  },
  {
    title: 'Authentication',
    label: '',
    to: '', // This is for dropdown links, so no direct link
    icon: <Shield size={18} />,
    sub: [
      {
        title: 'Sign In (email + password)',
        label: '',
        to: '/admin/sign-in', // Use "to" instead of "href"
        icon: <Hexagon size={18} />,
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    to: '/admin/settings', // Use "to" instead of "href"
    icon: <Settings size={18} />,
  },
];
