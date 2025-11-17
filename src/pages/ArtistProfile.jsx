import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { useCoins } from '../context/CoinContext'

const ArtistProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, refreshUserCoins } = useAuth()
  const { canVisitGallery, recordVisit, visitCost, freeVisitsRemaining } = useCoins()
  const [showCoinModal, setShowCoinModal] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)

  const { data: artist, isLoading: artistLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      const docSnap = await getDoc(doc(db, 'artists', id))
      if (!docSnap.exists()) {
        throw new Error('Artist not found')
      }
      return { id: docSnap.id, ...docSnap.data() }
    },
    enabled: !!id
  })

  const { data: artworks } = useQuery({
    queryKey: ['artworks', id],
    queryFn: async () => {
      const q = query(collection(db, 'artworks'), where('artistId', '==', id))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!id && accessGranted
  })

  useEffect(() => {
    const checkAccess = async () => {
      if (!artist) return

      if (canVisitGallery()) {
        try {
          const result = await recordVisit(id, null)
          setAccessGranted(true)
          if (user && result.newCoins !== undefined) {
            // Refresh user coins in context
            await refreshUserCoins()
          }
        } catch (error) {
          console.error('Failed to record visit:', error)
          setShowCoinModal(true)
        }
      } else {
        setShowCoinModal(true)
      }
    }

    checkAccess()
  }, [artist, canVisitGallery, recordVisit, id, user, refreshUserCoins])

  const handlePurchase = () => {
    navigate('/profile?tab=coins')
    setShowCoinModal(false)
  }

  if (artistLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Artist not found</h2>
          <button onClick={() => navigate('/gallery')} className="btn btn-primary">
            Back to Gallery
          </button>
        </div>
      </div>
    )
  }

  if (!accessGranted) {
    return (
      <>
        {/* Coin Modal */}
        {showCoinModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Access Required</h3>
              <p className="mb-4">
                {!user
                  ? `You've used all your free visits. You have ${freeVisitsRemaining || 0} free visits remaining. Please login to continue viewing artists.`
                  : `You need ${visitCost} coins to view this artist. You currently have ${user?.coins || 0} coins.`}
              </p>
              <div className="modal-action">
                {!user ? (
                  <>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">
                      Login
                    </button>
                    <button onClick={() => navigate('/gallery')} className="btn">
                      Go Back
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handlePurchase} className="btn btn-primary">
                      Purchase Coins
                    </button>
                    <button onClick={() => navigate('/gallery')} className="btn">
                      Go Back
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        {/* Artist Header */}
        <div className="card lg:card-side bg-base-200 shadow-xl mb-8">
          <figure className="lg:w-1/3">
            <img
              src={artist.avatarUrl || '/default-avatar.png'}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="card-body lg:w-2/3">
            <h1 className="card-title text-4xl">{artist.name}</h1>
            <p className="text-lg">{artist.bio}</p>
            {artist.tags && artist.tags.length > 0 && (
              <div className="card-actions mt-4">
                {artist.tags.map(tag => (
                  <span key={tag} className="badge badge-primary badge-lg">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {artist.social && (
              <div className="card-actions mt-4">
                {artist.social.instagram && (
                  <a
                    href={artist.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    Instagram
                  </a>
                )}
                {artist.social.website && (
                  <a
                    href={artist.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Artworks</h2>
          {artworks && artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map(artwork => (
                <div
                  key={artwork.id}
                  onClick={() => navigate(`/artwork/${artwork.id}`)}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                >
                  <figure>
                    <img
                      src={artwork.imageUrl || '/default-artwork.png'}
                      alt={artwork.title}
                      className="w-full h-64 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{artwork.title}</h3>
                    <p className="text-sm">
                      {artwork.year} • {artwork.medium}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg">No artworks available for this artist.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistProfile

