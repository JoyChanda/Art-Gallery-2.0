import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const ArticleDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      // Try to find by slug first
      let q = query(collection(db, 'articles'), where('slug', '==', slug))
      let snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        // Fallback to ID
        const docRef = doc(db, 'articles', slug)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() }
        }
        throw new Error('Article not found')
      }
      
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    },
    enabled: !!slug
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <button onClick={() => navigate('/articles')} className="btn btn-primary">
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate('/articles')} className="btn btn-ghost mb-4">
          ← Back to Articles
        </button>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <span>By {article.author || 'Admin'}</span>
              <span>•</span>
              <span>
                {article.publishedAt?.toDate?.().toLocaleDateString() ||
                  article.publishedAt?.toLocaleDateString() ||
                  'Recent'}
              </span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-2 mt-4">
                {article.tags.map(tag => (
                  <span key={tag} className="badge badge-primary">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div
            className="article-content"
            dangerouslySetInnerHTML={{
              __html: article.content || article.excerpt || ''
            }}
          />

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-base-300">
            <h3 className="text-xl font-semibold mb-4">Share this article</h3>
            <div className="flex gap-4">
              <button className="btn btn-outline btn-sm">Twitter</button>
              <button className="btn btn-outline btn-sm">Facebook</button>
              <button className="btn btn-outline btn-sm">Copy Link</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default ArticleDetail

