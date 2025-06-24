
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Switch, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Calendar, 
  FileText,
  LogOut,
  Moon,
  Sun,
  Menu as MenuIcon,
  Users,
  BarChart3,
  Shield
} from 'lucide-react';
import type { RootState } from '../../app/store';
import { logout, toggleTheme } from '../../features/auth/authSlice';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, theme } = useSelector((state: RootState) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Dean-specific menu items
  const deanMenuItems = [
    {
      key: '/dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Faculty Analytics',
    },
    {
      key: '/system-config',
      icon: <Settings className="w-4 h-4" />,
      label: 'System Configuration',
    },
    {
      key: '/sessions',
      icon: <Calendar className="w-4 h-4" />,
      label: 'All Sessions',
    },
    {
      key: '/courses',
      icon: <FileText className="w-4 h-4" />,
      label: 'All Courses',
    },
    {
      key: '/lecturers',
      icon: <User className="w-4 h-4" />,
      label: 'All Lecturers',
    },
    {
      key: '/questionnaires',
      icon: <FileText className="w-4 h-4" />,
      label: 'Questionnaires',
    }
  ];

  // HOD menu items
  const hodMenuItems = [
    {
      key: '/dashboard',
      icon: <User className="w-4 h-4" />,
      label: 'Dashboard',
    },
    {
      key: '/sessions',
      icon: <Calendar className="w-4 h-4" />,
      label: 'Sessions',
    },
    {
      key: '/courses',
      icon: <FileText className="w-4 h-4" />,
      label: 'Courses',
    },
    {
      key: '/lecturers',
      icon: <User className="w-4 h-4" />,
      label: 'Lecturers',
    },
    {
      key: '/students',
      icon: <Users className="w-4 h-4" />,
      label: 'Students',
    },
    {
      key: '/questionnaires',
      icon: <FileText className="w-4 h-4" />,
      label: 'Questionnaires',
    },
    {
      key: '/analytics',
      icon: <Settings className="w-4 h-4" />,
      label: 'Analytics',
    }
  ];

  const menuItems = user?.role === 'dean' ? deanMenuItems : hodMenuItems;

  const userMenuItems = [
    ...(user?.role === 'dean' ? [{
      key: 'profile',
      label: 'My Profile',
      icon: <User className="w-4 h-4" />,
      onClick: () => navigate('/profile'),
    }] : [{
      key: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
    }]),
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Sider 
        theme={theme === 'dark' ? 'dark' : 'light'}
        className="shadow-lg !fixed left-0 top-0 bottom-0 z-50"
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{ height: '100vh', overflow: 'auto' }}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Text className="text-white font-bold text-sm">TMS</Text>
            </div>
            {!collapsed && (
              <div>
                <Text className="font-semibold text-sm">Teaching Management</Text>
                <br />
                <Text className="text-xs text-gray-500">Cameroon Universities</Text>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          theme={theme === 'dark' ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Header className={`px-6 flex items-center justify-between shadow-sm ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b sticky top-0 z-40`}>
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={<MenuIcon className="w-4 h-4" />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Text className="text-lg font-semibold">
              {user?.role === 'dean' ? 'Dean Dashboard' : 
               user?.role === 'hod' ? `HOD - ${user.department}` : 'Dashboard'}
            </Text>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4" />
              <Switch
                checked={theme === 'dark'}
                onChange={handleThemeToggle}
                size="small"
              />
              <Moon className="w-4 h-4" />
            </div>

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" className="flex items-center space-x-2 h-10">
                <Avatar size="small" className="bg-primary-500">
                  {user?.role === 'dean' ? <Shield className="w-3 h-3" /> : user?.name.charAt(0).toUpperCase()}
                </Avatar>
                <span className="hidden md:inline">{user?.name}</span>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content className={`p-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        } min-h-[calc(100vh-64px)] overflow-auto`}>
          <div className="animate-fade-in">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
