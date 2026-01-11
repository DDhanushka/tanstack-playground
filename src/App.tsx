import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'
import type { Post } from './types'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const API_URL = 'http://localhost:3000/api'
  const queryClient = useQueryClient()
  // const fetchPosts = async () => {
  //   try {
  //     setLoading(true)  
  //     const response = await fetch(`${API_URL}/posts`)
  //     if (!response.ok) throw new Error('Failed to fetch posts')
  //     const data = await response.json()
  //     setPosts(data.posts)
  //     setError(null)
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An error occurred')  
  //   } finally {
  //     setLoading(false)  
  //   }
  // }


  const newPostFetch = async (): Promise<Post[]> => {
    try {
      const response = await fetch(`${API_URL}/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      return data.posts
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const addPost = async (newPost: Omit<Post, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      if (!response.ok) throw new Error('Failed to create post')
      return await response.json()
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  const deletePost = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete post')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
    }
  }

  // useEffect(() => {
  //   fetchPosts()  
  // }, [])

  const newPostMutation = useMutation({
    mutationFn: async (newPost: Omit<Post, 'id'>) => {
      return await addPost(newPost)
    }
    , onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await deletePost(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  const postQuery = useQuery({
    queryKey: ['posts'],
    queryFn: newPostFetch,
  })

  if (postQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (postQuery.isError) {
    return <div>Error loading posts.</div>
  }
  return (
    <div style={{ margin: '0', padding: '0px', minWidth: '300px' }}>

      {/* UI to add post */}
      <div>
        <h2>Add New Post</h2>
        <input type="text" placeholder="Title" id="titleInput" style={{ width: '100%', marginBottom: '5px' }} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" id="descriptionInput" style={{ width: '100%', marginBottom: '5px' }} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        {newPostMutation.isPending ? <div>Adding post...</div> :
          <button onClick={() => {
            newPostMutation.mutate({ title, description })
            setTitle('')
            setDescription('')
          }}>Add Post</button>
        }

      </div>
      <h2>Posts from SQLite API</h2>

      {postQuery.data?.map((post) => (
        <div key={post.id} style={{
          border: '1px solid #ccc',
          padding: '2px',
          marginBottom: '2px',
          opacity: deleteMutation.isPending && deleteMutation.variables === post.id ? 0.5 : 1,
          position: 'relative'
        }}>
          <h4>{post.title}</h4>
          <p>{post.description}</p>
          <button
            onClick={() => deleteMutation.mutate(post.id)}
            disabled={deleteMutation.isPending && deleteMutation.variables === post.id}
          >
            {deleteMutation.isPending && deleteMutation.variables === post.id
              ? 'Deleting...'
              : 'Delete Post'}
          </button>
        </div>
      ))}

      {/* <PostCreation
        apiUrl={API_URL}
        onPostCreated={fetchPosts}
        onError={setError}
      />
 */}
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</div>}

      {/* <PostWall
        posts={posts}
        loading={loading}
        onDeletePost={deletePost}
      /> */}
    </div>
  )
}

export default App
