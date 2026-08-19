import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, User } from 'lucide-react';

const tabs = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Search', icon: Search, path: '/cars-for-sale' },
  { label: 'Messages', icon: MessageSquare, path: '/messages' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const STORAGE_KEY = 'automax_tab_history';

function getActiveTab(pathname) {
  if (pathname === '/') return 'Home';
  for (const tab of tabs) {
    if (tab.path !== '/' && pathname.startsWith(tab.path)) return tab.label;
  }
  return null;
}

export default function BottomTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const tabHistory = useRef({});

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) tabHistory.current = JSON.parse(stored);
    } catch {}
  }, []);

  useEffect(() => {
    const activeTab = getActiveTab(location.pathname);
    if (activeTab) {
      tabHistory.current[activeTab] = location.pathname + location.search;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabHistory.current));
    }
  }, [location.pathname, location.search]);

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    const currentTab = getActiveTab(location.pathname);

    if (currentTab === tab.label) {
      // Re-selecting active tab → go to root (clear sub-history)
      tabHistory.current[tab.label] = tab.path;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabHistory.current));
      navigate(tab.path);
    } else {
      // Switching tabs → restore last visited path if available
      const lastPath = tabHistory.current[tab.label] || tab.path;
      navigate(lastPath);
    }
  };

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-stretch justify-around"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(56px + env(safe-area-inset-bottom))' }}
    >
      {tabs.map((tab) => {
        const isActive = getActiveTab(location.pathname) === tab.label;
        return (
          <a
            key={tab.label}
            href={tab.path}
            onClick={(e) => handleTabClick(e, tab)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </a>
        );
      })}
    </div>
  );
}