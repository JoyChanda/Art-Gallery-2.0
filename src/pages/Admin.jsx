import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'

const Admin = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('artists')

  // Artists
  const { data: artists } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'artists'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
  })

  // Artworks
  const { data: artworks } = useQuery({
    queryKey: ['admin-artworks'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'artworks'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
  })

  // Articles
  const { data: articles } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'articles'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
  })

  const addArtist = useMutation({
    mutationFn: async (data) => {
      await addDoc(collection(db, 'artists'), {
        ...data,
        createdAt: serverTimestamp()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-artists'])
    }
  })

  const addArtwork = useMutation({
    mutationFn: async (data) => {
      await addDoc(collection(db, 'artworks'), {
        ...data,
        createdAt: serverTimestamp()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-artworks'])
    }
  })

  const addArticle = useMutation({
    mutationFn: async (data) => {
      await addDoc(collection(db, 'articles'), {
        ...data,
        publishedAt: serverTimestamp()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-articles'])
    }
  })

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8">
          <button
            className={`tab ${activeTab === 'artists' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Artists
          </button>
          <button
            className={`tab ${activeTab === 'artworks' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('artworks')}
          >
            Artworks
          </button>
          <button
            className={`tab ${activeTab === 'articles' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
        </div>

        {/* Artists Tab */}
        {activeTab === 'artists' && (
          <div>
            <ArtistForm onSubmit={(data) => addArtist.mutate(data)} />
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">All Artists ({artists?.length || 0})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artists?.map(artist => (
                  <div key={artist.id} className="card bg-base-200 shadow">
                    <div className="card-body">
                      <h3 className="card-title">{artist.name}</h3>
                      <p className="text-sm line-clamp-2">{artist.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Artworks Tab */}
        {activeTab === 'artworks' && (
          <div>
            <ArtworkForm onSubmit={(data) => addArtwork.mutate(data)} artists={artists} />
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">All Artworks ({artworks?.length || 0})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artworks?.map(artwork => (
                  <div key={artwork.id} className="card bg-base-200 shadow">
                    <div className="card-body">
                      <h3 className="card-title">{artwork.title}</h3>
                      <p className="text-sm">{artwork.medium}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <ArticleForm onSubmit={(data) => addArticle.mutate(data)} />
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">All Articles ({articles?.length || 0})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles?.map(article => (
                  <div key={article.id} className="card bg-base-200 shadow">
                    <div className="card-body">
                      <h3 className="card-title">{article.title}</h3>
                      <p className="text-sm line-clamp-2">{article.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Form Components
const ArtistForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
    social: { instagram: '', website: '' },
    tags: ''
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const storageRef = ref(storage, `artists/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setFormData({ ...formData, avatarUrl: url })
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    setFormData({
      name: '',
      bio: '',
      avatarUrl: '',
      social: { instagram: '', website: '' },
      tags: ''
    })
  }

  return (
    <div className="card bg-base-200 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Add Artist</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">Name</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Bio</label>
            <textarea
              className="textarea textarea-bordered"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Avatar URL</label>
            <input
              type="url"
              className="input input-bordered"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            />
            <label className="label">
              <span className="label-text-alt">Or upload image:</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>
          <div className="form-control">
            <label className="label">Tags (comma separated)</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="oil, portrait, modern"
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Artist</button>
        </form>
      </div>
    </div>
  )
}

const ArtworkForm = ({ onSubmit, artists }) => {
  const [formData, setFormData] = useState({
    artistId: '',
    title: '',
    year: '',
    medium: '',
    dimensions: '',
    description: '',
    imageUrl: '',
    tags: '',
    price: ''
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const storageRef = ref(storage, `artworks/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setFormData({ ...formData, imageUrl: url })
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      year: formData.year ? parseInt(formData.year) : null,
      price: formData.price ? parseFloat(formData.price) : null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    setFormData({
      artistId: '',
      title: '',
      year: '',
      medium: '',
      dimensions: '',
      description: '',
      imageUrl: '',
      tags: '',
      price: ''
    })
  }

  return (
    <div className="card bg-base-200 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Add Artwork</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">Artist</label>
            <select
              className="select select-bordered"
              value={formData.artistId}
              onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
              required
            >
              <option value="">Select Artist</option>
              {artists?.map(artist => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">Title</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Year</label>
              <input
                type="number"
                className="input input-bordered"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">Medium</label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.medium}
                onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">Dimensions</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="e.g., 24 x 30 inches"
            />
          </div>
          <div className="form-control">
            <label className="label">Description</label>
            <textarea
              className="textarea textarea-bordered"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label">Image URL</label>
            <input
              type="url"
              className="input input-bordered"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <label className="label">
              <span className="label-text-alt">Or upload image:</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>
          <div className="form-control">
            <label className="label">Price (optional)</label>
            <input
              type="number"
              step="0.01"
              className="input input-bordered"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label">Tags (comma separated)</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="portrait, oil, modern"
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Artwork</button>
        </form>
      </div>
    </div>
  )
}

const ArticleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    tags: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')
    onSubmit({
      ...formData,
      slug,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      tags: ''
    })
  }

  return (
    <div className="card bg-base-200 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Add Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">Title</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Slug (optional, auto-generated if empty)</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="article-url-slug"
            />
          </div>
          <div className="form-control">
            <label className="label">Excerpt</label>
            <textarea
              className="textarea textarea-bordered"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Content (HTML)</label>
            <textarea
              className="textarea textarea-bordered h-32"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Author</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label">Tags (comma separated)</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="news, art, modern"
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Article</button>
        </form>
      </div>
    </div>
  )
}

export default Admin

