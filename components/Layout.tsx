import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Menu, X, LogIn, LogOut, User as UserIcon, ChevronDown, LayoutDashboard } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper for link classes
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? "text-brand-green font-bold border-b-2 border-brand-green whitespace-nowrap" : "text-brand-darkGreen hover:text-brand-green transition-colors whitespace-nowrap";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-cream text-brand-darkGreen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-sm border-b-2 border-brand-green/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center mr-3">
                 <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Commons<span className="text-brand-salmon">Youth</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-6 text-sm font-medium">
              <NavLink to="/" className={linkClass}>หน้าหลัก</NavLink>
              <NavLink to="/about" className={linkClass}>เกี่ยวกับเรา</NavLink>
              <NavLink to="/map" className={linkClass}>แผนที่</NavLink>
              <NavLink to="/community" className={linkClass}>ชุมชน</NavLink>
              <NavLink to="/activities" className={linkClass}>กิจกรรม</NavLink>
              <NavLink to="/projects" className={linkClass}>โครงการ</NavLink>
              <NavLink to="/partners" className={linkClass}>ภาคีเครือข่าย</NavLink>
            </div>

            {/* Desktop Auth Profile Dropdown */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none hover:bg-brand-green/10 p-2 rounded-lg transition-colors border border-transparent hover:border-brand-green/20"
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center overflow-hidden border border-brand-darkGreen shadow-sm">
                       {user.profileImage ? (
                         <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <UserIcon className="w-5 h-5 text-white" />
                       )}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="text-xs font-bold text-brand-darkGreen max-w-[100px] truncate">{user.name || 'User'}</div>
                      <div className="text-[10px] text-brand-earth truncate max-w-[100px]">Member</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-brand-earth transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border-2 border-brand-gray overflow-hidden py-1 z-50">
                      <div className="px-4 py-3 border-b border-brand-gray bg-brand-cream/30">
                        <p className="text-xs text-brand-earth mb-0.5">เข้าสู่ระบบในชื่อ</p>
                        <p className="text-sm font-bold text-brand-darkGreen truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            navigate('/dashboard');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-brand-darkGreen hover:bg-brand-cream rounded-lg flex items-center transition-colors mb-1"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3 text-brand-green" />
                          <div>
                            <span className="font-bold block">แดชบอร์ด</span>
                            <span className="text-xs text-brand-earth block">จัดการกลุ่มและข้อมูลส่วนตัว</span>
                          </div>
                        </button>
                      </div>
                      
                      <div className="border-t border-brand-gray/50 mx-2 my-1"></div>
                      
                      <div className="p-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-brand-salmon font-bold hover:bg-brand-salmon/10 rounded-lg flex items-center transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          ออกจากระบบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center px-5 py-2.5 bg-brand-darkGreen text-white rounded-xl hover:bg-brand-green transition-all font-bold text-sm shadow-retro hover:shadow-none hover:translate-y-1"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  เข้าสู่ระบบ
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-darkGreen p-2 hover:bg-brand-green/10 rounded-lg">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-brand-cream border-b border-brand-gray pb-4 px-4 shadow-xl h-[calc(100vh-80px)] overflow-y-auto fixed w-full z-40">
            <div className="flex flex-col space-y-4 mt-4">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-2 py-1">หน้าหลัก</NavLink>
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-2 py-1">เกี่ยวกับเรา</NavLink>
              <NavLink to="/map" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-2 py-1">แผนที่</NavLink>
              <NavLink to="/community" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-2 py-1">ชุมชน</NavLink>
              <NavLink to="/activities" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-2 py-1">กิจกรรม</NavLink>
              <NavLink to="/projects" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-2 py-1">โครงการ</NavLink>
              <NavLink to="/partners" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium px-2 py-1">ภาคีเครือข่าย</NavLink>
              
              <div className="pt-4 border-t border-brand-gray/50">
                {user ? (
                   <div className="flex flex-col space-y-3">
                      <div className="flex items-center px-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center overflow-hidden border border-brand-darkGreen mr-3">
                           <img src={user.profileImage || "https://ui-avatars.com/api/?name=User"} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-brand-darkGreen">{user.name}</div>
                          <div className="text-xs text-brand-earth">{user.email}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                        className="flex items-center justify-center w-full px-4 py-3 bg-brand-green text-white rounded-lg shadow-sm"
                      >
                        <LayoutDashboard className="w-5 h-5 mr-2" />
                        จัดการข้อมูล (Dashboard)
                      </button>
                      <button 
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-brand-salmon text-brand-salmon rounded-lg font-bold hover:bg-brand-salmon hover:text-white transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        ออกจากระบบ
                      </button>
                   </div>
                ) : (
                  <button 
                    onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                    className="flex items-center justify-center w-full px-4 py-3 bg-brand-darkGreen text-white rounded-lg font-bold shadow-retro"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    เข้าสู่ระบบ
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-darkGreen text-brand-cream py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-2xl mb-4">Commons Youth</h3>
              <p className="opacity-80 max-w-xs text-sm">
                เชื่อมโยงกลุ่มพลังเยาวชนทั่วประเทศไทยเพื่อสร้างอนาคตที่ดีกว่า
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-brand-yellow">ลิงก์</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><NavLink to="/about" className="hover:text-brand-salmon">เกี่ยวกับเรา</NavLink></li>
                <li><NavLink to="/projects" className="hover:text-brand-salmon">โครงการ</NavLink></li>
                <li><NavLink to="/partners" className="hover:text-brand-salmon">ภาคีเครือข่าย</NavLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-brand-salmon">เชื่อมต่อกับเรา</h4>
              <p className="text-sm opacity-80 mb-2">support@commonsyouth.org</p>
              <div className="flex space-x-4 mt-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 bg-brand-cream/20 rounded-full hover:bg-brand-cream/40 cursor-pointer flex items-center justify-center">FB</div>
                <div className="w-8 h-8 bg-brand-cream/20 rounded-full hover:bg-brand-cream/40 cursor-pointer flex items-center justify-center">IG</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs opacity-60">
            © 2024 Commons Youth Platform. สงวนลิขสิทธิ์
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;