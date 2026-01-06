import { useState, useEffect } from 'react'
import './App.css'

interface Post {
  id: number
  title: string
  description: string
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPost, setNewPost] = useState({ title: '', description: '' })

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

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      if (!response.ok) throw new Error('Failed to create post')
      setNewPost({ title: '', description: '' })
      fetchPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
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

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#a3a3a3ff', borderRadius: '8px' }}>
        <h2>Create New Post</h2>
        <form onSubmit={createPost}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              placeholder="Description"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', fontSize: '16px', minHeight: '80px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Create Post
          </button>
        </form>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</div>}
      {loading && <div>Loading posts...</div>}

      <div>
        <h2>All Posts ({posts.length})</h2>
        {posts.length === 0 && !loading && <p>No posts found. Create one above!</p>}
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              backgroundColor: '#3f3f3fff'
            }}
          >
            <h3 style={{ marginTop: 0 }}>{post.title}</h3>
            <p style={{ color: '#ffffffff' }}>{post.description}</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <small style={{ color: '#999' }}>ID: {post.id}</small>
              <button
                onClick={() => deletePost(post.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
