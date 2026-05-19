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
import { auth, db } from '../services/firebaseConfig';

type UserRole = 'admin' | 'citizen' | null;

interface AuthContextData {
  user: User | null;
  userData: any | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
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

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Listener em tempo real para os dados do usuário no Firestore
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
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
        setUserData(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const login = async (identifier: string, pass: string) => {
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
    await signOut(auth);
  };

  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteDoc(doc(db, 'users', currentUser.uid));
      await deleteUser(currentUser);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, userData, role, loading, login, register, logout, deleteAccount, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
