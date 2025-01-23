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
    title: 'Students',
    label: '',
    to: '/admin/tasks', // Use "to" instead of "href"
    icon: <CheckSquare size={18} />,
  },
  {
    title: 'Content',
    label: '',
    to: '/admin/content', // Use "to" instead of "href"
    icon: <AppWindowIcon size={18} />,
  },
];
