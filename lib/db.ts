import { sql } from '@vercel/postgres';

// posts 테이블 생성
export async function createPostsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT,
        date VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Posts 테이블이 생성되었습니다.');
    return { success: true };
  } catch (error) {
    console.error('Posts 테이블 생성 중 오류 발생:', error);
    return { success: false, error };
  }
}

// 포스트 가져오기
export async function getAllPosts() {
  try {
    const posts = await sql`
      SELECT * FROM posts 
      ORDER BY date DESC
    `;
    return posts.rows;
  } catch (error) {
    console.error('포스트 가져오기 중 오류 발생:', error);
    throw error;
  }
}

// 포스트 추가하기
export async function addPost(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image_url?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO posts (title, slug, excerpt, content, date, category, image_url)
      VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.date}, ${post.category}, ${post.image_url || null})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('포스트 추가 중 오류 발생:', error);
    throw error;
  }
}

// 포스트 수정하기
export async function updatePost(
  id: number,
  post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    image_url?: string;
  }
) {
  try {
    const result = await sql`
      UPDATE posts
      SET 
        title = ${post.title},
        slug = ${post.slug},
        excerpt = ${post.excerpt},
        content = ${post.content},
        date = ${post.date},
        category = ${post.category},
        image_url = ${post.image_url || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('포스트 수정 중 오류 발생:', error);
    throw error;
  }
}

// 포스트 삭제하기
export async function deletePost(slug: string) {
  try {
    const result = await sql`
      DELETE FROM posts
      WHERE slug = ${slug}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('포스트 삭제 중 오류 발생:', error);
    throw error;
  }
}

// 슬러그로 포스트 가져오기
export async function getPostBySlug(slug: string) {
  try {
    const result = await sql`
      SELECT * FROM posts
      WHERE slug = ${slug}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('포스트 가져오기 중 오류 발생:', error);
    throw error;
  }
}

// ID로 포스트 가져오기
export async function getPostById(id: number) {
  try {
    const result = await sql`
      SELECT * FROM posts
      WHERE id = ${id}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('포스트 가져오기 중 오류 발생:', error);
    throw error;
  }
} 