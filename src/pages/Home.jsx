import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'

const Home = () => {
  const videoRef = useRef(null)

  // Set video playback rate to 1.2x (between 1.15-1.25 as requested)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.2
    }
  }, [])

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
      <section className="relative h-[85vh] min-h-[500px] md:h-[90vh] w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/Capture.JPG"
          aria-label="Art Gallery Hero Video"
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

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
              Welcome to the Art Gallery
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-white/90 max-w-2xl mx-auto">
              Discover beautiful artworks and explore the world of art
            </p>
            <Link
              to="/gallery"
              className="btn btn-primary btn-lg md:btn-xl gap-2 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Discover Artworks - Navigate to Gallery"
            >
              <span>Discover</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-12 md:py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Featured Artists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredArtists?.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/artist/${artist.id}`}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg overflow-hidden"
                  aria-label={`View ${artist.name}'s profile`}
                >
                  <figure>
                    <img
                      src={artist.avatarUrl || '/default-avatar.png'}
                      alt={`${artist.name} - Artist`}
                      className="w-full h-64 object-cover"
                      loading="lazy"
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
      <section className="py-12 md:py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Latest Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recentArticles?.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/articles/${article.slug || article.id}`}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                  aria-label={`Read article: ${article.title}`}
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
          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/articles"
              className="btn btn-outline btn-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="View all articles"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
