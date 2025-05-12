import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TestFirebase() {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [userData, setUserData] = useState<any>(null);

  const testFirebaseConnection = async () => {
    try {
      // Test 1: Check if auth is initialized
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      // Test 2: Check if Firestore is initialized
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      // Test 3: Try to get current user
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Test 4: Try to read from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setTestResult('✅ All Firebase tests passed!');
        } else {
          setTestResult('⚠️ User document not found in Firestore');
        }
      } else {
        setTestResult('⚠️ No user is currently signed in');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`);
    }
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      <Text style={styles.result}>{testResult}</Text>
      
      {userData && (
        <View style={styles.userData}>
          <Text style={styles.subtitle}>User Data:</Text>
          <Text>Name: {userData.name || 'N/A'}</Text>
          <Text>Email: {userData.email || 'N/A'}</Text>
          <Text>Farm: {userData.farm || 'N/A'}</Text>
        </View>
      )}

      <Button 
        title="Run Test Again" 
        onPress={testFirebaseConnection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginBottom: 20,
  },
  userData: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
}); 