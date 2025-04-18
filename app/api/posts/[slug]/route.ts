import { NextResponse } from 'next/server';
import { getPostBySlug, updatePost, deletePost } from '@/lib/db';

// GET - 특정 포스트 조회
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // 데이터베이스에서 포스트 조회
    const post = await getPostBySlug(slug);
    
    // 포스트가 없으면 404 반환
    if (!post) {
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('포스트 조회 오류:', error);
    return NextResponse.json(
      { error: '포스트를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT - 포스트 수정
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // 기존 포스트 조회
    const existingPost = await getPostBySlug(slug);
    
    // 포스트가 없으면 404 반환
    if (!existingPost) {
      return NextResponse.json(
        { error: '수정할 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 수정할 포스트 데이터 가져오기
    const postData = await request.json();
    
    // 필수 필드 검증
    if (!postData.title || !postData.content || !postData.category) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 포스트 데이터 구성
    const post = {
      title: postData.title,
      slug: postData.slug || slug,
      excerpt: postData.excerpt || '',
      content: postData.content,
      date: postData.date || new Date().toISOString().split('T')[0],
      category: postData.category,
      image_url: postData.imageUrl || null
    };
    
    // 데이터베이스에 업데이트
    const updatedPost = await updatePost(existingPost.id, post);
    
    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('포스트 수정 오류:', error);
    return NextResponse.json(
      { error: '포스트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - 포스트 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // 데이터베이스에서 포스트 삭제
    const deletedPost = await deletePost(slug);
    
    // 포스트가 없으면 404 반환
    if (!deletedPost) {
      return NextResponse.json(
        { error: '삭제할 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: '포스트가 삭제되었습니다.' });
  } catch (error) {
    console.error('포스트 삭제 오류:', error);
    return NextResponse.json(
      { error: '포스트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 