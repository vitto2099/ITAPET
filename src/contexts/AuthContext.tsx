import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  deleteUser,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/firebaseConfig';

type UserRole = 'admin' | 'citizen' | null;

export const MOCK_CITIZEN_USER = {
  uid: 'teste-cidadao-uid',
  email: 'cidadao.teste@itapet.com',
  displayName: 'Cidadão de Teste',
} as unknown as User;

export const MOCK_CITIZEN_DATA = {
  uid: 'teste-cidadao-uid',
  nome: 'Cidadão de Teste',
  cpf: '000.000.000-00',
  telefone: '(47) 99999-9999',
  email: 'cidadao.teste@itapet.com',
  role: 'citizen',
  bairro: 'Centro',
  createdAt: new Date().toISOString()
};

export const MOCK_VET_USER = {
  uid: 'teste-vet-uid',
  email: 'vet.teste@itapet.com',
  displayName: 'Veterinário de Teste',
} as unknown as User;

export const MOCK_VET_DATA = {
  uid: 'teste-vet-uid',
  nome: 'Dr(a). Veterinário(a) (Teste)',
  cpf: '111.111.111-11',
  telefone: '(47) 98888-8888',
  email: 'vet.teste@itapet.com',
  role: 'admin',
  bairro: 'Centro',
  crmv: 'CRMV-SC 12345',
  createdAt: new Date().toISOString()
};

interface AuthContextData {
  user: User | null;
  userData: any | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsTest: (roleType: 'citizen' | 'admin') => Promise<void>;
  register: (email: string, pass: string, extraData: any) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const initAuth = async () => {
      try {
        const savedMock = await AsyncStorage.getItem('@itapet_mock_session');
        if (savedMock === 'admin') {
          setUser(MOCK_VET_USER);
          setUserData(MOCK_VET_DATA);
          setRole('admin');
          setLoading(false);
          return;
        } else if (savedMock === 'citizen') {
          setUser(MOCK_CITIZEN_USER);
          setUserData(MOCK_CITIZEN_DATA);
          setRole('citizen');
          setLoading(false);
          return;
        }
      } catch (e) {
        // Ignora erro
      }
    };

    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await AsyncStorage.removeItem('@itapet_mock_session').catch(() => {});
        setUser(firebaseUser);
        
        // Listener em tempo real para os dados do usuário no Firestore
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', firebaseUser.uid), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserData(data);
            setRole(data.role as UserRole);
          } else {
            setUserData(null);
            setRole('citizen');
          }
          setLoading(false);
        }, (error) => {
          console.error("Erro no listener de usuário:", error);
          setLoading(false);
        });
      } else {
        const savedMock = await AsyncStorage.getItem('@itapet_mock_session').catch(() => null);
        if (!savedMock) {
          setUserData(null);
          setRole(null);
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const loginAsTest = async (roleType: 'citizen' | 'admin') => {
    if (roleType === 'admin') {
      setUser(MOCK_VET_USER);
      setUserData(MOCK_VET_DATA);
      setRole('admin');
      await AsyncStorage.setItem('@itapet_mock_session', 'admin');
    } else {
      setUser(MOCK_CITIZEN_USER);
      setUserData(MOCK_CITIZEN_DATA);
      setRole('citizen');
      await AsyncStorage.setItem('@itapet_mock_session', 'citizen');
    }
  };

  const login = async (identifier: string, pass: string) => {
    const idLower = identifier.trim().toLowerCase();
    const passLower = pass.trim().toLowerCase();

    // Atalhos para credenciais de teste digitadas no formulário
    if (
      (idLower === 'teste' || idLower === 'testecidadao' || idLower === 'cidadao') &&
      (passLower === 'teste' || passLower === '123456')
    ) {
      await loginAsTest('citizen');
      return;
    }

    if (
      (idLower === 'testevet' || idLower === 'vet' || idLower === 'admin') &&
      (passLower === 'teste' || passLower === '123456' || passLower === 'admin')
    ) {
      await loginAsTest('admin');
      return;
    }

    let emailToLogin = identifier;

    // Verificar se o identificador parece um CPF (apenas números ou formatado)
    const cleanCPF = identifier.replace(/[^\d]/g, '');
    
    if (cleanCPF.length === 11) {
      // É um CPF, buscar o e-mail correspondente no Firestore
      const usersRef = collection(db, 'users');
      
      // Tenta buscar com o formato original (caso tenha máscara) e apenas números
      const q = query(usersRef, where('cpf', '==', identifier));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        emailToLogin = querySnapshot.docs[0].data().email;
      } else {
        // Tenta buscar apenas com os números caso esteja salvo sem máscara
        const qClean = query(usersRef, where('cpf', '==', cleanCPF));
        const querySnapshotClean = await getDocs(qClean);
        if (!querySnapshotClean.empty) {
          emailToLogin = querySnapshotClean.docs[0].data().email;
        }
      }
    }

    await signInWithEmailAndPassword(auth, emailToLogin, pass);
  };

  const register = async (email: string, pass: string, extraData: any) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    
    const userProfile = {
      uid: result.user.uid,
      email,
      role: 'citizen' as UserRole,
      ...extraData,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', result.user.uid), userProfile);
    setUserData(userProfile);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@itapet_mock_session').catch(() => {});
    setUser(null);
    setUserData(null);
    setRole(null);
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Erro ao sair:", e);
      }
    }
  };

  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteDoc(doc(db, 'users', currentUser.uid));
      await deleteUser(currentUser);
    }
    await logout();
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, userData, role, loading, login, loginAsTest, register, logout, deleteAccount, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
