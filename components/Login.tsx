import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { auth } from '../src/services/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Mapear usuário do Firebase para o formato esperado pelo App
      const appUser = {
        id: user.uid,
        firstName: user.displayName?.split(' ')[0] || 'Usuário',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        store: 'Loja Padrão',
        role: 'vendedor',
        lastLogin: new Date().toISOString(),
        photoUrl: user.photoURL
      };
      
      onLogin(appUser);
    } catch (err: any) {
      console.error('Erro de login:', err);
      setError('Erro ao autenticar com Google: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-purple-500/10 border border-gray-100 p-10 space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-purple-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-500/30">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Conquista <span className="text-purple-600">App</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-2">Acesso Restrito</p>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 text-gray-800 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-gray-200/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? 'Autenticando...' : 'Entrar com Google'}
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
