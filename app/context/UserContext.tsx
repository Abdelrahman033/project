import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/config/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';

interface Farm {
  id: string;
  name: string;
  size: number;
  location: {
    latitude: number;
    longitude: number;
  };
  crops: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  farmName: string;
  location: string;
  lastVisit: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  addFarm: (farm: Farm) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  updateUserProfile: async () => {},
  refreshUser: async () => {},
  addFarm: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserProfile = async (data: Partial<User>) => {
    if (!auth.currentUser || !user) return;

    try {
      // Update in Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });

      // Update in Firebase Auth if name is being changed
      if (data.name) {
        await updateProfile(auth.currentUser, {
          displayName: data.name
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addFarm = async (farm: Farm) => {
    if (!auth.currentUser || !user) return;

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        farms: arrayUnion(farm),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding farm:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: auth.currentUser.uid,
          name: userData.name,
          email: userData.email,
          farmName: userData.farmName,
          location: userData.location,
          lastVisit: userData.lastVisit,
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Set up real-time listener for user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUser({
              id: firebaseUser.uid,
              name: userData.name,
              email: userData.email,
              farmName: userData.farmName,
              location: userData.location,
              lastVisit: userData.lastVisit,
            });
          }
        }, (error) => {
          console.error('Error in user snapshot:', error);
        });

        // Initial fetch
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: userData.name,
              email: userData.email,
              farmName: userData.farmName,
              location: userData.location,
              lastVisit: userData.lastVisit,
            });
          }
        } catch (error) {
          console.error('Error fetching initial user data:', error);
        }

        return () => unsubscribeUser();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateUserProfile, refreshUser, addFarm }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); 