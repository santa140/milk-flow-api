import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Droplets, 
  CreditCard, 
  TrendingUp, 
  UserCheck, 
  Route,
  Settings,
  LogOut,
  Menu,
  X,
  Milk
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
  adminOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    title: 'Farmers',
    icon: Users,
    href: '/farmers',
  },
  {
    title: 'Collections',
    icon: Droplets,
    href: '/collections',
  },
  {
    title: 'Payments',
    icon: CreditCard,
    href: '/payments',
  },
  {
    title: 'Analytics',
    icon: TrendingUp,
    href: '/analytics',
    adminOnly: true,
  },
  {
    title: 'Staff',
    icon: UserCheck,
    href: '/staff',
    adminOnly: true,
  },
  {
    title: 'Routes',
    icon: Route,
    href: '/routes',
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.is_admin || user?.role === 'admin';

  const filteredItems = sidebarItems.filter(item => 
    !item.adminOnly || isAdmin
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Milk className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-xl font-bold gradient-text">DairyChain Pro</h1>
                <p className="text-sm text-muted-foreground">Supply Chain Management</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "group-hover:text-foreground"
              )} />
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium overflow-hidden whitespace-nowrap"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {item.badge && !isCollapsed && (
                <span className="ml-auto px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border/50">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-card/50",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center text-white text-sm font-semibold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="font-medium text-sm truncate">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role || 'User'} • {user?.is_admin ? 'Admin' : 'Standard'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-3 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-3",
              isCollapsed ? "justify-center px-0" : ""
            )}
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span>Settings</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 text-destructive hover:text-destructive",
              isCollapsed ? "justify-center px-0" : ""
            )}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden glass-card"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-20" : "w-80"
      )}>
        <SidebarContent />
        
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-background hover:bg-muted"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="w-3 h-3" />
        </Button>
      </aside>
    </>
  );
}