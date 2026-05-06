import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { auth } from '../src/services/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAnonymousAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      
      const appUser = {
        id: user.uid,
        firstName: 'Visitante',
        lastName: '',
        store: 'Loja Padrão',
        role: 'visitante',
        lastLogin: new Date().toISOString(),
      };
      
      onLogin(appUser);
    } catch (err: any) {
      console.error('Erro de autenticação anônima:', err);
      setError('Erro no acesso anônimo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cria um email fictício usando o identificador, removendo caracteres inválidos
      const sanitisedIdentifier = identifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (!sanitisedIdentifier) {
        throw new Error("Identificador inválido.");
      }

      const email = `${sanitisedIdentifier}@loja.com`;
      
      console.log('Tentando autenticar com email:', email); // Debug
      
      let result;
      if (isRegistering) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        alert('Conta criada com sucesso! Agora você pode entrar.');
        setIsRegistering(false);
        setPassword('');
        setLoading(false);
        return;
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const user = result.user;
      
      const appUser = {
        id: user.uid,
        firstName: identifier.split('.')[0] || 'Usuário',
        lastName: '',
        store: 'Loja Padrão',
        role: 'vendedor',
        lastLogin: new Date().toISOString(),
      };
      
      onLogin(appUser);
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setError('Erro: ' + err.message);
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
              {isRegistering ? 'Primeiro Acesso' : 'Acesso Restrito'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Seu identificador (ex: nome.sobrenome)"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all font-bold text-sm"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all font-bold text-sm"
          />
        </div>

        {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

        <button
          onClick={handleAuth}
          disabled={loading || !identifier || !password}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? 'Processando...' : (isRegistering ? 'Criar Acesso' : 'Entrar')}
        </button>

        <button
          onClick={handleAnonymousAuth}
          disabled={loading}
          className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] border border-gray-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          Entrar como Visitante
        </button>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-purple-600 transition-colors"
        >
          {isRegistering ? 'Já tenho acesso. Entrar.' : 'Primeiro acesso? Cadastrar.'}
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
