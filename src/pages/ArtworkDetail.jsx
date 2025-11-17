import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const ArtworkDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: artwork, isLoading } = useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      const docSnap = await getDoc(doc(db, 'artworks', id))
      if (!docSnap.exists()) {
        throw new Error('Artwork not found')
      }
      return { id: docSnap.id, ...docSnap.data() }
    },
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Artwork not found</h2>
          <button onClick={() => navigate('/gallery')} className="btn btn-primary">
            Back to Gallery
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4">
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Artwork Image */}
          <div className="card bg-base-200 shadow-xl">
            <figure>
              <img
                src={artwork.imageUrl || '/default-artwork.png'}
                alt={artwork.title}
                className="w-full h-full object-contain"
              />
            </figure>
          </div>

          {/* Artwork Details */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-4xl mb-4">{artwork.title}</h1>
              
              <div className="space-y-4">
                {artwork.year && (
                  <div>
                    <span className="font-semibold">Year: </span>
                    <span>{artwork.year}</span>
                  </div>
                )}
                
                {artwork.medium && (
                  <div>
                    <span className="font-semibold">Medium: </span>
                    <span>{artwork.medium}</span>
                  </div>
                )}
                
                {artwork.dimensions && (
                  <div>
                    <span className="font-semibold">Dimensions: </span>
                    <span>{artwork.dimensions}</span>
                  </div>
                )}
                
                {artwork.description && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-base leading-relaxed">{artwork.description}</p>
                  </div>
                )}
                
                {artwork.provenance && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg mb-2">Provenance</h3>
                    <p className="text-base">{artwork.provenance}</p>
                  </div>
                )}
                
                {artwork.price && (
                  <div className="mt-4">
                    <span className="font-semibold text-lg">Price: </span>
                    <span className="text-primary text-xl font-bold">${artwork.price.toLocaleString()}</span>
                  </div>
                )}
                
                {artwork.tags && artwork.tags.length > 0 && (
                  <div className="card-actions mt-6">
                    {artwork.tags.map(tag => (
                      <span key={tag} className="badge badge-primary badge-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworkDetail

