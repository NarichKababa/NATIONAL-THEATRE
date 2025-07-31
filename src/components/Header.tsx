import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Theater, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  onLoginClick: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shows', label: 'Shows' },
    { path: '/artists', label: 'Artists' },
    { path: '/reviews', label: 'Reviews' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
              <Theater className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Uganda National Theatre</h1>
              <p className="text-xs text-amber-600">Online Booking</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-amber-600"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-amber-200"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-amber-600 hover:to-orange-700 transition-all"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-amber-600"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-amber-600"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-3 mt-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}