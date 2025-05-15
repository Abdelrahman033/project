import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserContextType } from '@/types/auth';
import { auth, db } from '@/config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up real-time listener for user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Set up real-time listener for user document
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setUser({
                ...userData,
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                farms: userData.farms || [],
                role: userData.role || 'farmer',
              } as User);
            }
          }, (error) => {
            console.error('Error in user snapshot:', error);
            setError('Failed to sync user data');
          });

          // Initial fetch
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...userData,
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              farms: userData.farms || [],
              role: userData.role || 'farmer',
            } as User);
          } else {
            // Create new user document if it doesn't exist
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email || '',
              role: 'farmer',
              farms: [],
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }

          return () => unsubscribeUser();
        } else {
          setUser(null);
        }
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          ...userData,
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          farms: userData.farms || [],
          role: userData.role || 'farmer',
        } as User);
      } else {
        throw new Error('User document not found');
      }
    } catch (err) {
      setError('Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError('Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No user is signed in');
      }
      
      // Ensure farms array is preserved
      const updatedData = {
        ...updates,
        farms: updates.farms || user.farms || [],
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updatedData);

      // Update in Firebase Auth if name is being changed
      if (updates.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name
        });
      }

      // The real-time listener will automatically update the user state
    } catch (err) {
      setError('Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, signIn, signOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 