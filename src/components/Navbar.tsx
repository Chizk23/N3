import React from 'react';
import { 
  BookIcon, 
  LayersIcon, 
  SearchIcon, 
  ChartIcon, 
  UploadIcon, 
  SettingsIcon, 
  FlameIcon, 
  TimerIcon, 
  SunIcon, 
  MoonIcon,
  SparklesIcon 
} from './Icons';

export type TabType = 'dashboard' | 'vocab' | 'grammar' | 'mimikara' | 'dictionary' | 'stats' | 'import' | 'settings';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  streak: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMiniTest: () => void;
  dueTodayCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  streak,
  darkMode,
  onToggleDarkMode,
  onOpenMiniTest,
  dueTodayCount
}) => {
  const navItems: { tab: TabType; label: string; icon: React.FC<{ size?: number; className?: string }>; badge?: number }[] = [
    { tab: 'dashboard', label: 'Trang chủ', icon: BookIcon },
    { tab: 'vocab', label: 'Từ vựng (1260)', icon: BookIcon, badge: dueTodayCount },
    { tab: 'grammar', label: 'Ngữ pháp (230)', icon: LayersIcon },
    { tab: 'mimikara', label: 'Mimikara (880)', icon: SparklesIcon },
    { tab: 'dictionary', label: 'Tra cứu', icon: SearchIcon },
    { tab: 'stats', label: 'Thống kê', icon: ChartIcon },
    { tab: 'import', label: 'Nhập dữ liệu', icon: UploadIcon },
    { tab: 'settings', label: 'Cài đặt', icon: SettingsIcon },
  ];

  return (
    <header className="w-full border-b border-app-border bg-app-surface notebook-fade sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Top header row */}
        <div className="h-16 flex items-center justify-between text-xs sm:text-sm text-app-muted">
          {/* Logo brand */}
          <div 
            onClick={() => onSelectTab('dashboard')} 
            className="cursor-pointer flex items-center gap-2.5 select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-app-accent text-white flex items-center justify-center font-bold text-sm tracking-wide">
              N3
            </div>
            <div>
              <span className="font-semibold text-app-text tracking-wide text-base">JLPT N3 SỔ TAY</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-app-muted">SRS Master</span>
            </div>
          </div>

          {/* Right action group */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Streak */}
            <div className="flex items-center gap-1.5 text-app-text font-medium text-xs sm:text-sm">
              <FlameIcon size={17} className="text-amber-500" />
              <span>{streak} ngày liên tiếp</span>
            </div>

            {/* Mini Test */}
            <button
              type="button"
              onClick={onOpenMiniTest}
              className="flex items-center gap-1.5 text-app-accent hover:underline font-medium text-xs sm:text-sm"
            >
              <TimerIcon size={16} />
              <span>Thi thử mini</span>
            </button>

            {/* Dark mode */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="flex items-center gap-1.5 hover:text-app-text text-xs sm:text-sm transition-colors"
              title={darkMode ? 'Giao diện sáng' : 'Giao diện tối'}
            >
              {darkMode ? <SunIcon size={18} className="text-amber-400" /> : <MoonIcon size={18} />}
              <span className="hidden md:inline">{darkMode ? 'Sáng' : 'Tối'}</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar pt-1 text-sm border-t border-app-border/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => onSelectTab(item.tab)}
                className={`py-3 whitespace-nowrap notebook-fade flex items-center gap-2 text-xs sm:text-sm ${
                  isActive
                    ? 'text-app-text font-semibold border-b-2 border-app-accent'
                    : 'text-app-muted hover:text-app-text border-b-2 border-transparent'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-app-accent' : 'text-app-muted'} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[11px] rounded-full bg-app-accent text-white font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
