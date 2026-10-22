import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile, UserRole } from '../types';
import { isValidCPF } from '../utils/cpfValidator';

// Perfil Oficial da Secretaria de Meio Ambiente de Itaiópolis (Responsável pelos Mutirões)
export const OFFICIAL_MUNICIPAL_PROFILE: UserProfile = {
  uid: 'secretaria-meio-ambiente-itaiopolis',
  nome: 'Secretaria de Agricultura e Meio Ambiente',
  cpf: '',
  telefone: '(47) 3652-2211',
  email: 'meioambiente@itaiopolis.sc.gov.br',
  role: 'admin',
  bairro: 'Centro',
  crmv: 'CRMV-SC Oficial',
  criadoEm: '2026-01-01T00:00:00.000Z'
};

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  loginAsDemo: (roleType: 'citizen' | 'admin') => void;
  registerWithCpf: (cpf: string, pass: string, nome?: string) => Promise<void>;
  register: (email: string, pass: string, profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificar sessão ativa no localStorage
    const savedSession = localStorage.getItem('itapet_auth_session') || localStorage.getItem('itapet_demo_session');
    if (savedSession === 'admin') {
      setUserData(OFFICIAL_MUNICIPAL_PROFILE);
      setRole('admin');
      setUser({ uid: OFFICIAL_MUNICIPAL_PROFILE.uid, email: OFFICIAL_MUNICIPAL_PROFILE.email } as any);
      setLoading(false);
      return;
    } else if (savedSession && savedSession !== 'citizen') {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.profile) {
          setUserData(parsed.profile);
          setRole(parsed.role || 'citizen');
          setUser({ uid: parsed.profile.uid, email: parsed.profile.email } as any);
          setLoading(false);
          return;
        }
      } catch {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setUserData(data);
            setRole(data.role || 'citizen');
          } else {
            const fallback: UserProfile = {
              uid: fbUser.uid,
              nome: fbUser.displayName || 'Munícipe',
              email: fbUser.email || '',
              cpf: '',
              role: 'citizen',
              criadoEm: new Date().toISOString()
            };
            setUserData(fallback);
            setRole('citizen');
          }
        } catch (e) {
          console.warn("Aviso ao ler perfil do Firestore:", e);
        }
      } else {
        const active = localStorage.getItem('itapet_auth_session') || localStorage.getItem('itapet_demo_session');
        if (!active || active === 'citizen') {
          setUser(null);
          setUserData(null);
          setRole(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemo = (roleType: 'citizen' | 'admin') => {
    if (roleType === 'admin') {
      localStorage.setItem('itapet_auth_session', 'admin');
      setUserData(OFFICIAL_MUNICIPAL_PROFILE);
      setRole('admin');
      setUser({ uid: OFFICIAL_MUNICIPAL_PROFILE.uid, email: OFFICIAL_MUNICIPAL_PROFILE.email } as any);
    }
  };

  const registerWithCpf = async (cpf: string, pass: string, nome?: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!isValidCPF(cpf)) {
      throw new Error("CPF inválido segundo o algoritmo oficial da Receita Federal (dígitos verificadores incorretos).");
    }
    if (pass.length < 6) {
      throw new Error("A senha deve conter no mínimo 6 dígitos.");
    }

    const formattedCpf = cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    const syntheticEmail = `${cleanCpf}@cidadao.itapet.gov.br`;

    const newProfile: UserProfile = {
      uid: `cidadao-${cleanCpf}`,
      nome: nome?.trim() || `Munícipe (${formattedCpf})`,
      cpf: formattedCpf,
      email: syntheticEmail,
      role: 'citizen',
      criadoEm: new Date().toISOString()
    };

    // Salva no registro local de munícipes
    try {
      const stored = JSON.parse(localStorage.getItem('itapet_registered_citizens') || '{}');
      stored[cleanCpf] = { profile: newProfile, pass };
      localStorage.setItem('itapet_registered_citizens', JSON.stringify(stored));
      localStorage.setItem('itapet_auth_session', JSON.stringify({ role: 'citizen', profile: newProfile }));
    } catch {}

    // Tenta sincronizar com Firebase se disponível
    try {
      const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, pass);
      newProfile.uid = cred.user.uid;
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUser(cred.user);
    } catch (fbErr) {
      // Se Firebase falhar (já existe ou offline), autentica na sessão local
      setUser({ uid: newProfile.uid, email: syntheticEmail } as any);
    }

    setUserData(newProfile);
    setRole('citizen');
  };

  const login = async (identifier: string, pass: string) => {
    const idLower = identifier.trim().toLowerCase();
    const passLower = pass.trim().toLowerCase();

    // Acesso administrativo oficial da Secretaria Municipal
    if ((idLower === 'admin' || idLower === 'vet' || idLower === 'meioambiente') && (passLower === 'admin' || passLower === '123456' || passLower === 'itapet')) {
      loginAsDemo('admin');
      return;
    }

    const cleanCpf = identifier.replace(/\D/g, '');

    // 1. Checa no registro local de munícipes cadastrados por CPF
    if (cleanCpf.length === 11) {
      try {
        const stored = JSON.parse(localStorage.getItem('itapet_registered_citizens') || '{}');
        if (stored[cleanCpf]) {
          if (stored[cleanCpf].pass === pass) {
            const p = stored[cleanCpf].profile;
            setUserData(p);
            setRole('citizen');
            setUser({ uid: p.uid, email: p.email } as any);
            localStorage.setItem('itapet_auth_session', JSON.stringify({ role: 'citizen', profile: p }));
            return;
          } else {
            throw new Error("Senha incorreta para este CPF.");
          }
        }
      } catch (e: any) {
        if (e.message?.includes("Senha incorreta")) throw e;
      }
    }

    // 2. Se for CPF válido de 11 dígitos e senha de 6+ caracteres, autentica o munícipe
    if (cleanCpf.length === 11 && pass.length >= 6) {
      const formattedCpf = cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      const syntheticEmail = `${cleanCpf}@cidadao.itapet.gov.br`;
      
      try {
        await signInWithEmailAndPassword(auth, syntheticEmail, pass);
        return;
      } catch (fbErr) {
        // Fallback: loga localmente como o cidadão deste CPF
        const p: UserProfile = {
          uid: `cidadao-${cleanCpf}`,
          nome: `Munícipe (${formattedCpf})`,
          cpf: formattedCpf,
          email: syntheticEmail,
          role: 'citizen',
          criadoEm: new Date().toISOString()
        };
        setUserData(p);
        setRole('citizen');
        setUser({ uid: p.uid, email: p.email } as any);
        localStorage.setItem('itapet_auth_session', JSON.stringify({ role: 'citizen', profile: p }));
        return;
      }
    }

    // 3. Login convencional por email (ex: veterinário da prefeitura)
    let emailToLogin = identifier.trim();
    await signInWithEmailAndPassword(auth, emailToLogin, pass);
  };

  const register = async (email: string, pass: string, profile: Partial<UserProfile>) => {
    if (profile.cpf) {
      await registerWithCpf(profile.cpf, pass, profile.nome);
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      nome: profile.nome || 'Munícipe',
      cpf: profile.cpf || '',
      telefone: profile.telefone || '',
      bairro: profile.bairro || 'Centro',
      role: 'citizen',
      criadoEm: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setUserData(newProfile);
    setRole('citizen');
    setUser(cred.user);
  };

  const logout = async () => {
    localStorage.removeItem('itapet_auth_session');
    localStorage.removeItem('itapet_demo_session');
    setUser(null);
    setUserData(null);
    setRole(null);
    try {
      await signOut(auth);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, userData, role, loading, login, loginAsDemo, registerWithCpf, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
