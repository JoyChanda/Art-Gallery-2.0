import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get or create user document
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          // First time login - create user document with 100 coins
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            phone: '',
            coins: 100,
            firstLoginAwarded: true,
            freeVisitsUsed: 0,
            createdAt: serverTimestamp()
          })
          setUser({ ...firebaseUser, coins: 100 })
        } else {
          const userData = userSnap.data()
          // Award coins if first login not awarded
          if (!userData.firstLoginAwarded) {
            await updateDoc(userRef, {
              coins: (userData.coins || 0) + 100,
              firstLoginAwarded: true
            })
            setUser({ ...firebaseUser, coins: (userData.coins || 0) + 100 })
          } else {
            setUser({ ...firebaseUser, coins: userData.coins || 0 })
          }
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider)
  }

  const signInWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const registerWithEmail = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Update display name if provided
    if (displayName) {
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        displayName
      })
    }
    return userCredential
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  const updateUserProfile = async (updates) => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, updates)
    setUser({ ...user, ...updates })
  }

  const refreshUserCoins = async () => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const userData = userSnap.data()
      setUser({ ...user, coins: userData.coins || 0 })
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    signOut,
    updateUserProfile,
    refreshUserCoins
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

