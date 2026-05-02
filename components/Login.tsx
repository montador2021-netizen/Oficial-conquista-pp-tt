import React, { useState } from 'react';
import { User } from '../src/types';
import { motion } from 'motion/react';
import { ShieldCheck, User as UserIcon, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const names = nomeCompleto.trim().split(/\s+/).filter(Boolean);
      if (names.length < 1) {
        setError('Por favor, digite seu nome.');
        setLoading(false);
        return;
      }
      
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      
      const users: User[] = JSON.parse(localStorage.getItem('conquista_app_users') || '[]');
      const existingUser = users.find(u => 
        u.firstName.toLowerCase() === firstName.toLowerCase() && 
        u.lastName.toLowerCase() === lastName.toLowerCase()
      );

      if (existingUser) {
        if (existingUser.password === senha) {
          onLogin(existingUser);
        } else {
          setError('Senha incorreta.');
        }
      } else {
        // Auto-create user
        const customId = `VC-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;

        const newUser: User = {
          id: customId,
          firstName,
          lastName,
          store: 'Loja 1',
          password: senha,
          role: (firstName.toLowerCase() === 'valmir' && lastName.toLowerCase() === 'melo') ? 'admin' : 'vendedor',
          lastLogin: new Date().toISOString(),
          photoUrl: "https://picsum.photos/seed/" + customId + "/100/100"
        };

        users.push(newUser);
        localStorage.setItem('conquista_app_users', JSON.stringify(users));
        onLogin(newUser);
      }
    } catch (err: any) {
      console.error('Erro de login:', err);
      setError('Erro no login.');
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

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                placeholder="Nome Completo (Conforme Cadastro)"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Sua Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all"
              />
              <div className="flex justify-end mt-2">
                <button 
                  type="button"
                  onClick={() => setError("Entre em contato com o administrador para redefinir sua senha.")}
                  className="text-[10px] text-gray-400 hover:text-purple-600 font-bold uppercase tracking-widest underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 p-4 rounded-2xl border border-red-100"
            >
              <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest leading-relaxed">
                {error}
              </p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : (
              <>
                Entrar no Sistema
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
      
      <p className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Conquista App Gestão de Alta Performance</p>
    </div>
  );
};

export default Login;
