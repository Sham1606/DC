'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, LogOut } from 'lucide-react'

interface NavItem {
  name: string;
  path: string;
  icon: JSX.Element;
  description: string;
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, onClose, navItems, isAuthenticated, onLogout }: SidebarProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
  <>
    {/* Overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}

    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 left-0 z-50 md:w-72 w-[280px] lg:w-[320px] bg-white shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg md:text-xl font-semibold text-primary flex items-center">
          <span className="mr-2">Menu</span>
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-10rem)] px-2">
        <div className="space-y-2 p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center p-2 md:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {item.icon}
              <div className="ml-3">
                <span className="block text-xs md:text-sm font-medium">{item.name}</span>
                <span className="block text-[10px] md:text-xs text-gray-500">{item.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
      {isAuthenticated ? (
            <Button onClick={onLogout} className="w-full" variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={onClose}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <Button className="w-full bg-primary">Sign Up</Button>
              </Link>
            </div>
          )}
      </div>
    </motion.div>
    </>   
  )
}