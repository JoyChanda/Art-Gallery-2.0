import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'

const Profile = () => {
  const { user, updateUserProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const activeTab = searchParams.get('tab') || 'profile'
  
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const { data: visits } = useQuery({
    queryKey: ['visits', user?.uid],
    queryFn: async () => {
      if (!user) return []
      const q = query(
        collection(db, 'visits'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date()
      }))
    },
    enabled: !!user && activeTab === 'visits'
  })

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !user) return

    setUploadingPhoto(true)
    try {
      const storageRef = ref(storage, `profile-photos/${user.uid}`)
      await uploadBytes(storageRef, file)
      const photoURL = await getDownloadURL(storageRef)
      await updateUserProfile({ photoURL })
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      await updateUserProfile({
        displayName,
        phone
      })
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8">
          <button
            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            onClick={() => navigate('/profile?tab=profile')}
          >
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'coins' ? 'tab-active' : ''}`}
            onClick={() => navigate('/profile?tab=coins')}
          >
            My Coins
          </button>
          <button
            className={`tab ${activeTab === 'visits' ? 'tab-active' : ''}`}
            onClick={() => navigate('/profile?tab=visits')}
          >
            Visit History
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Profile</h2>
              
              <div className="flex flex-col items-center mb-6">
                <div className="avatar mb-4">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.photoURL || '/default-avatar.png'} alt="Profile" />
                  </div>
                </div>
                <label className="btn btn-sm btn-outline">
                  {uploadingPhoto ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Change Photo'
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered"
                    value={user.email || ''}
                    disabled
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Display Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="input input-bordered"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Coins Tab */}
        {activeTab === 'coins' && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">My Coins</h2>
              
              <div className="text-center py-8">
                <div className="badge badge-primary badge-lg p-6 text-4xl mb-4">
                  {user.coins || 0} Coins
                </div>
                <p className="text-lg mb-6">
                  Each gallery visit costs 10 coins. Purchase more coins to continue exploring!
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    // TODO: Implement coin purchase with Stripe/PayPal
                    alert('Coin purchase feature coming soon!')
                  }}
                >
                  Purchase Coins
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Visit History</h2>
              
              {visits && visits.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Artist</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map(visit => (
                        <tr key={visit.id}>
                          <td>
                            {visit.timestamp?.toLocaleString() || 'Recent'}
                          </td>
                          <td>
                            <button
                              className="link link-primary"
                              onClick={() => navigate(`/artist/${visit.artistId}`)}
                            >
                              View Artist
                            </button>
                          </td>
                          <td>{visit.cost} coins</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-8">No visits recorded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

