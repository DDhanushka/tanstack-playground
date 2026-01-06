import { useEffect, useState } from 'react'
import './App.css'
import { PostCreation } from './components/PostCreation'
import { PostWall } from './components/PostWall'
import type { Post } from './types'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = 'http://localhost:3000/api'

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data.posts)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete post')
      fetchPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Posts from SQLite API</h1>

      <PostCreation
        apiUrl={API_URL}
        onPostCreated={fetchPosts}
        onError={setError}
      />

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</div>}

      <PostWall
        posts={posts}
        loading={loading}
        onDeletePost={deletePost}
      />
    </div>
  )
}

export default App
