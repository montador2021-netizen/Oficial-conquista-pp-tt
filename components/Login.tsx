import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { auth } from '../src/services/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const appUser = {
        id: user.uid,
        firstName: user.displayName?.split(' ')[0] || 'Usuário',
        lastName: user.displayName?.split(' ')?.slice?.(1)?.join(' ') || '',
        store: 'Loja Padrão',
        role: 'vendedor',
        lastLogin: new Date().toISOString(),
        photoUrl: user.photoURL ?? undefined
      };
      
      onLogin(appUser);
    } catch (err: any) {
      console.error('Erro de autenticação com Google:', err);
      setError('Erro no acesso com Google: ' + err.message);
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
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-2">
              Acesso Restrito
            </p>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
        
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] border border-gray-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          Entrar com Google
        </button>

      </motion.div>
    </div>
  );
};

export default Login;
