'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import {Sheet,SheetContent,SheetTrigger} from '@/components/ui/sheet';
import {Menu,X,Utensils,Activity,LineChart,User,Zap, LogOut,} from 'lucide-react';
import Sidebar from './Sidebar';
import { RootState, AppDispatch } from '../../redux/store'; 
import { logout } from '../../redux/slices/authSlice';



const navItems = [
  {
    name: 'Meal Planner',
    path: '/meal-planner',
    icon: <Utensils className="h-5 w-5 mr-2" />,
    description: 'Personalized nutrition plans',
  },
  {
    name: 'Health Profile',
    path: '/health-profile',
    icon: <Activity className="h-5 w-5 mr-2" />,
    description: 'Comprehensive health insights',
  },
  {
    name: 'Progress Tracker',
    path: '/progress',
    icon: <LineChart className="h-5 w-5 mr-2" />,
    description: 'Track your wellness journey',
  },
  {
    name: 'Nutrition Coach',
    path: '/nutrition',
    icon: <User className="h-5 w-5 mr-2" />,
    description: 'AI-powered nutrition guidance',
  },
];

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
        <div className="container mx-auto flex items-center justify-between h-16 sm:h-20 px-4 max-w-7xl">
          {/* Logo */}
          <Link
            to="/"
            className="flex px-20 text-3xl font-bold text-primary hover:text-blue-600 transition-colors duration-300"
          >
            <Zap className="h-7 w-7 sm:h-8 sm:w-8 mr-2 text-yellow-500" />
            <span className="hidden sm:inline">DietCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 px-4">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="group flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-300"
                >
                  {item.icon}
                  <span className="ml-2 group-hover:text-blue-600">{item.name}</span>
                  <span className="ml-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="bg-primary">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu - Hidden for tablets (md) */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden" // Only visible for screens smaller than md
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <div className="mt-8 space-y-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100"
                  >
                    {item.icon}
                    <div className="ml-3">
                      <span className="block text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-gray-500">{item.description}</span>
                    </div>
                  </Link>
                ))}

                <div className="flex flex-col space-y-4 pt-4 border-t">
                  <Link to="/login" onClick={() => setIsSidebarOpen(false)}>
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsSidebarOpen(false)}>
                    <Button className="bg-primary">Start Free Trial</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
}
