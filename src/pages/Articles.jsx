import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

const Articles = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const q = query(collection(db, 'articles'), orderBy('publishedAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt?.toDate?.() || new Date()
        }
      })
    }
  })

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
        <h1 className="text-5xl font-bold mb-12 text-center">Articles</h1>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link
                key={article.id}
                to={`/articles/${article.slug || article.id}`}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl">{article.title}</h2>
                  <p className="text-sm line-clamp-3">{article.excerpt}</p>
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="text-xs text-base-content/70">
                      <span>{article.author || 'Admin'}</span>
                      <span className="mx-2">•</span>
                      <span>{article.publishedAt?.toLocaleDateString() || 'Recent'}</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex gap-2">
                        {article.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="badge badge-outline badge-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl">No articles available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Articles

