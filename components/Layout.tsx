import React from 'react';
import { ViewState } from '../types';
import { 
  Sprout, 
  Target, 
  FlaskConical, 
  BookOpen, 
  Activity, 
  Settings, 
  Menu,
  Bot
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'herbs', label: '中药学', icon: Sprout },
    { id: 'acupoints', label: '经络穴位', icon: Target },
    { id: 'formulas', label: '方剂学', icon: FlaskConical },
    { id: 'exam', label: '重点考点', icon: BookOpen },
    { id: 'skills', label: '技能操作', icon: Activity },
    { id: 'ai_chat', label: 'AI 灵枢助手', icon: Bot },
  ];

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-tcm-50 text-tcm-900 font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-tcm-800 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <h1 className="text-xl font-serif font-bold">灵枢 LingShu</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky md:top-0 h-screen z-40 bg-tcm-900 text-tcm-100 w-64 flex flex-col transition-transform duration-300 shadow-xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-tcm-700">
          <h1 className="text-2xl font-serif font-bold text-white tracking-wider flex items-center gap-2">
            <span className="text-accent text-3xl">☯</span> 灵枢
          </h1>
          <p className="text-xs text-tcm-400 mt-1">中医学习大师</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${currentView === item.id 
                      ? 'bg-tcm-800 text-white shadow-lg border-l-4 border-accent' 
                      : 'hover:bg-tcm-800/50 hover:text-white text-tcm-300'}`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-tcm-700">
          <button 
             onClick={() => handleNavClick('admin')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
             ${currentView === 'admin' ? 'bg-accent text-white' : 'hover:bg-tcm-800 text-tcm-300'}`}
          >
            <Settings size={20} />
            <span>后台管理</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-60px)] md:h-screen relative">
        {children}
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;