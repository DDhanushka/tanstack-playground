import type { Post } from "../types"

interface PostWallProps {
  posts: Post[]
  loading: boolean
  onDeletePost: (id: number) => void
}

export function PostWall({ posts, loading, onDeletePost }: PostWallProps) {
  if (loading) {
    return <div>Loading posts...</div>
  }

  return (
    <div>
      <h2>All Posts ({posts.length})</h2>
      {posts.length === 0 ? (
        <p>No posts found. Create one above!</p>
      ) : (
        posts.map((post) => (
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
                onClick={() => onDeletePost(post.id)}
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
        ))
      )}
    </div>
  )
}
