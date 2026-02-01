import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Chrome } from 'lucide-react';

const Login: React.FC = () => {
  const { loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      alert("การเข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-2 border-brand-obsidian overflow-hidden">
        <div className="bg-brand-obsidian p-6 text-center">
          <h2 className="text-3xl font-bold text-brand-linen">ยินดีต้อนรับกลับ</h2>
          <p className="text-brand-bud opacity-80 mt-2">เข้าสู่ระบบเพื่อจัดการกลุ่มเยาวชนของคุณ</p>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-bud rounded-full mb-4 border-2 border-brand-obsidian">
               <span className="font-bold text-2xl text-brand-obsidian">C</span>
            </div>
            <h3 className="text-xl font-bold text-brand-obsidian">Commons<span className="text-brand-orange">Youth</span></h3>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-white border-2 border-brand-gray text-brand-obsidian font-bold rounded-xl hover:bg-brand-linen hover:border-brand-obsidian transition-all shadow-retro active:shadow-none active:translate-y-1 flex items-center justify-center gap-3"
          >
            <Chrome className="w-5 h-5 text-brand-ocean" />
            {loading ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบด้วย Google'}
          </button>

          <div className="mt-8 text-center">
            <p className="text-xs text-brand-earth">
              โดยการเข้าสู่ระบบ คุณยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัวของแพลตฟอร์ม
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;