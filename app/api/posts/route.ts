import { NextResponse } from 'next/server';
import { createPostsTable, getAllPosts, addPost } from '@/lib/db';

// 서버 시작시 posts 테이블 생성
createPostsTable().catch(error => {
  console.error('테이블 생성 실패:', error);
});

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    
    // 필수 필드 검증
    if (!postData.title || !postData.slug || !postData.content || !postData.category) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 파일명에 사용할 형식의 날짜 생성
    const date = postData.date || new Date().toISOString().split('T')[0];
    
    // 포스트 데이터 구성
    const post = {
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt || '',
      content: postData.content,
      date,
      category: postData.category,
      image_url: postData.imageUrl || null
    };
    
    // 데이터베이스에 저장
    const savedPost = await addPost(post);
    
    return NextResponse.json({ success: true, post: savedPost });
  } catch (error) {
    console.error('포스트 저장 오류:', error);
    return NextResponse.json(
      { error: '포스트 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 데이터베이스에서 모든 포스트 가져오기
    const posts = await getAllPosts();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('포스트 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '포스트 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 