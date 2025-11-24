// app/posts/page.tsx
export default async function PostsPage() {
  let posts: any[] = []
  
  try {
    // Dynamic import Prisma client untuk avoid build errors
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    posts = await prisma.post.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.log('Database error:', error)
    // Fallback data untuk production
    posts = [
      {
        id: 1,
        title: "Contoh Post 1",
        content: "Contoh Konten dari Post 1",
        createdAt: new Date(),
        user: { name: "KhenT8" }
      },
      {
        id: 2, 
        title: "Contoh Post 2",
        content: "Contoh Konten dari Post 2",
        createdAt: new Date(),
        user: { name: "HopKick123" }
      }
    ]
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #007acc', paddingBottom: '10px' }}>
        Daftar Posts
      </h1>
      
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '50px' }}>
          Belum ada posts.
        </p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {posts.map((post: any) => (
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
                <strong>Pada:</strong> {new Date(post.createdAt).toLocaleDateString('id-ID')} 
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}