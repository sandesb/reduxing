import {
  AppWindowIcon,
  CheckSquare,
  Hexagon,
  LayoutDashboard,
  Settings,
  Shield,
} from 'lucide-react'
export const sidelinks = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: 'Tasks',
    label: '3',
    href: '/tasks',
    icon: <CheckSquare size={18} />,
  },
  {
    title: 'Apps',
    label: '',
    href: '/apps',
    icon: <AppWindowIcon size={18} />,
  },
  {
    title: 'Authentication',
    label: '',
    href: '',
    icon: <Shield size={18} />,
    sub: [
      {
        title: 'Sign In (email + password)',
        label: '',
        href: '/sign-in',
        icon: <Hexagon size={18} />,
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '/admin/settings',
    icon: <Settings size={18} />,
  },
]
