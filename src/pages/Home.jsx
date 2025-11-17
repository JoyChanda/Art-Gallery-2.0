import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'

const Home = () => {
  const { data: featuredArtists } = useQuery({
    queryKey: ['featuredArtists'],
    queryFn: async () => {
      const q = query(collection(db, 'artists'), orderBy('createdAt', 'desc'), limit(3))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
  })

  const { data: recentArticles } = useQuery({
    queryKey: ['recentArticles'],
    queryFn: async () => {
      const q = query(collection(db, 'articles'), orderBy('publishedAt', 'desc'), limit(3))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/v2.mp4"
        >
          <source src="/v2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Fallback image for accessibility */}
        <img
          src="/Capture.JPG"
          alt="Art Gallery Background"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          aria-hidden="true"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Welcome to the Art Gallery
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover beautiful artworks and explore the world of art
            </p>
            <Link to="/gallery" className="btn btn-primary btn-lg">
              Discover Artworks
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists?.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/artist/${artist.id}`} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                  <figure>
                    <img
                      src={artist.avatarUrl || '/default-avatar.png'}
                      alt={artist.name}
                      className="w-full h-64 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{artist.name}</h3>
                    <p className="text-sm line-clamp-2">{artist.bio}</p>
                    <div className="card-actions justify-end mt-4">
                      <span className="badge badge-primary">{artist.tags?.[0] || 'Artist'}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles?.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/articles/${article.slug}`}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="card-body">
                    <h3 className="card-title">{article.title}</h3>
                    <p className="text-sm line-clamp-3">{article.excerpt}</p>
                    <div className="card-actions justify-between items-center mt-4">
                      <span className="text-xs text-base-content/70">
                        {article.publishedAt?.toDate?.().toLocaleDateString() || 'Recent'}
                      </span>
                      <span className="badge badge-outline">Read More</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/articles" className="btn btn-outline btn-lg">
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

