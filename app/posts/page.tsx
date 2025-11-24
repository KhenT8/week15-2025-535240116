// app/posts/page.tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define type untuk Post dengan User
type PostWithUser = {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date | null
  userId: number | null
  user: {
    id: number
    name: string
    email: string
  } | null
}

export default async function PostsPage() {
  let posts: PostWithUser[] = []
  
  try {
    posts = await prisma.post.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }) as PostWithUser[]
  } catch (error) {
    console.log('Database error:', error)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #007acc', paddingBottom: '10px' }}>
        Daftar Posts
      </h1>
      
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '50px' }}>
          Belum ada posts. Silakan tambah data melalui Prisma Studio.
        </p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {posts.map((post: PostWithUser) => (
            <div 
              key={post.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                margin: '15px 0', 
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ color: '#007acc', margin: '0 0 10px 0' }}>
                {post.title}
              </h2>
              <p style={{ 
                color: '#555', 
                lineHeight: '1.6',
                margin: '10px 0'
              }}>
                {post.content}
              </p>
              <div style={{ 
                fontSize: '14px', 
                color: '#888',
                borderTop: '1px solid #eee',
                paddingTop: '10px',
                marginTop: '15px'
              }}>
                <strong>Dibuat oleh:</strong> {post.user?.name || 'Unknown'} 
                <br />
                <strong>Pada:</strong> {post.createdAt.toLocaleDateString('id-ID')} 
                {post.updatedAt && (
                  <>
                    <br />
                    <strong>Diupdate:</strong> {post.updatedAt.toLocaleDateString('id-ID')}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}