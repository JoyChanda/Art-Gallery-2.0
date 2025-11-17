import { createContext, useContext, useState, useEffect } from 'react'
import { collection, addDoc, serverTimestamp, runTransaction, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from './AuthContext'

const CoinContext = createContext({})

export const useCoins = () => useContext(CoinContext)

const FREE_VISITS_LIMIT = 3
const VISIT_COST = 10

export const CoinProvider = ({ children }) => {
  const { user } = useAuth()
  const [freeVisitsUsed, setFreeVisitsUsed] = useState(0)

  useEffect(() => {
    // Load free visits from localStorage for anonymous users
    const stored = localStorage.getItem('freeVisitsUsed')
    if (stored) {
      setFreeVisitsUsed(parseInt(stored, 10))
    }
  }, [])

  const canVisitGallery = () => {
    if (!user) {
      // Anonymous users get 3 free visits
      return freeVisitsUsed < FREE_VISITS_LIMIT
    } else {
      // Logged in users need coins
      return user.coins >= VISIT_COST
    }
  }

  const recordVisit = async (artistId, artworkId = null) => {
    // Check if user can visit
    if (!canVisitGallery()) {
      throw new Error('Insufficient coins or free visits exhausted')
    }

    if (!user) {
      // Anonymous user - record free visit
      const newCount = freeVisitsUsed + 1
      setFreeVisitsUsed(newCount)
      localStorage.setItem('freeVisitsUsed', newCount.toString())
      
      // Record visit in Firestore (no cost)
      await addDoc(collection(db, 'visits'), {
        userId: null,
        artistId,
        artworkId,
        cost: 0,
        timestamp: serverTimestamp(),
        type: 'gallery_visit'
      })
      
      return { success: true, cost: 0, freeVisit: true }
    } else {
      // Logged in user - deduct coins atomically
      const userRef = doc(db, 'users', user.uid)
      
      try {
        const result = await runTransaction(db, async (transaction) => {
          const userSnap = await transaction.get(userRef)
          if (!userSnap.exists()) {
            throw new Error('User document does not exist')
          }

          const userData = userSnap.data()
          const currentCoins = userData.coins || 0

          if (currentCoins < VISIT_COST) {
            throw new Error('Insufficient coins')
          }

          const newCoins = currentCoins - VISIT_COST

          // Update user coins
          transaction.update(userRef, { coins: newCoins })

          // Record visit
          const visitRef = doc(collection(db, 'visits'))
          transaction.set(visitRef, {
            userId: user.uid,
            artistId,
            artworkId,
            cost: VISIT_COST,
            timestamp: serverTimestamp(),
            type: 'gallery_visit'
          })

          return { newCoins, visitId: visitRef.id }
        })

        return {
          success: true,
          cost: VISIT_COST,
          newCoins: result.newCoins,
          visitId: result.visitId
        }
      } catch (error) {
        throw error
      }
    }
  }

  const value = {
    canVisitGallery,
    recordVisit,
    freeVisitsUsed,
    visitCost: VISIT_COST,
    freeVisitsRemaining: FREE_VISITS_LIMIT - freeVisitsUsed
  }

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>
}

