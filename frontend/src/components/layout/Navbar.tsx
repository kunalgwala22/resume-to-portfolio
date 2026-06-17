import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Moon, Sun, LayoutDashboard, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-border/40 bg-dark/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
            PortfolioVerse AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2 min-w-0" aria-label="Toggle theme">
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-400" />}
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-border/40" />
              <Link to="/dashboard/settings" className="hover:opacity-85 flex items-center gap-2">
                <Avatar src={user.avatarUrl} alt={user.fullName || user.username} size="sm" />
                <span className="hidden sm:inline text-sm text-gray-300 font-medium">{user.fullName || user.username}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/login'); }} className="p-2 min-w-0" aria-label="Logout">
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
