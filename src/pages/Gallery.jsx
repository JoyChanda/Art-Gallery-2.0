import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const { data: artists, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const q = query(collection(db, 'artists'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
  })

  // Get all unique tags
  const allTags = useMemo(() => {
    if (!artists) return []
    const tagsSet = new Set()
    artists.forEach(artist => {
      if (artist.tags && Array.isArray(artist.tags)) {
        artist.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet)
  }, [artists])

  // Filter artists
  const filteredArtists = useMemo(() => {
    if (!artists) return []
    return artists.filter(artist => {
      const matchesSearch =
        searchTerm === '' ||
        artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTag =
        selectedTag === '' ||
        (artist.tags && artist.tags.includes(selectedTag))
      
      return matchesSearch && matchesTag
    })
  }, [artists, searchTerm, selectedTag])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8 text-center">Gallery</h1>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="form-control w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search artists..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              className={`btn btn-sm ${selectedTag === '' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedTag('')}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Artists Grid */}
        {filteredArtists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No artists found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map(artist => (
              <Link
                key={artist.id}
                to={`/artist/${artist.id}`}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <figure>
                  <img
                    src={artist.avatarUrl || '/default-avatar.png'}
                    alt={artist.name}
                    className="w-full h-64 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{artist.name}</h2>
                  <p className="text-sm line-clamp-3">{artist.bio}</p>
                  <div className="card-actions justify-end mt-4">
                    {artist.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="badge badge-primary badge-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery

