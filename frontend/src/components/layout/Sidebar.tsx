import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../stores/ui.store';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, FileText, Palette, Settings, BarChart3, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', path: '/dashboard/resumes', icon: FileText },
    { name: 'Templates', path: '/dashboard/templates', icon: Palette },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings }
  ];

  return (
    <aside
      className={cn(
        "border-r border-border/40 bg-dark h-[calc(100vh-64px)] sticky top-16 flex flex-col justify-between transition-all duration-300 z-30",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col gap-2 p-3">
        {/* Collapse Button */}
        <div className={cn("flex items-center", sidebarOpen ? "justify-end" : "justify-center")}>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 min-w-0" aria-label="Toggle sidebar">
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Button>
        </div>

        {/* Links list */}
        <nav className="flex flex-col gap-1 mt-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-gray-100 hover:bg-surface"
                )
              }
            >
              <link.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{link.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Profile info footer */}
      {sidebarOpen && user && (
        <div className="p-4 border-t border-border/40 flex items-center gap-3 bg-surface/25">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <User size={16} />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium text-gray-100 truncate">{user.fullName || user.username}</span>
            <span className="text-xs text-gray-500 truncate">{user.email}</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
