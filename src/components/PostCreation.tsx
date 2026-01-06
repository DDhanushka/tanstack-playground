import { useState } from 'react'

interface PostCreationProps {
  onPostCreated: () => void
  onError: (error: string) => void
  apiUrl: string
}

export function PostCreation({ onPostCreated, onError, apiUrl }: PostCreationProps) {
  const [newPost, setNewPost] = useState({ title: '', description: '' })

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      if (!response.ok) throw new Error('Failed to create post')
      setNewPost({ title: '', description: '' })
      onPostCreated()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create post')
    }
  }

  return (
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
  )
}
