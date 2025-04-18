import { NextResponse } from 'next/server';
import { createPostsTable, addPost } from '@/lib/db';

// 샘플 포스트 데이터
const samplePosts = [
  {
    title: '블로그를 시작하며',
    slug: 'starting-a-blog',
    excerpt: '블로그를 시작하게 된 이유와 앞으로의 계획에 대해 이야기합니다.',
    content: `<h1>블로그를 시작하며</h1>
<p>안녕하세요! 이 블로그를 통해 개발 경험과 지식을 공유하려고 합니다.</p>
<p>주로 웹 개발, React, Next.js 관련 내용을 다룰 예정입니다.</p>
<h2>블로그 주제</h2>
<ul>
  <li>웹 개발 팁과 트릭</li>
  <li>React와 Next.js 튜토리얼</li>
  <li>프로젝트 경험 공유</li>
</ul>
<p>앞으로 많은 관심 부탁드립니다!</p>`,
    date: '2025-04-18',
    category: '일상',
    image_url: undefined
  },
  {
    title: 'Next.js로 블로그 만들기',
    slug: 'creating-blog-with-nextjs',
    excerpt: 'Next.js를 사용하여 개인 블로그를 만드는 방법을 소개합니다.',
    content: `<h1>Next.js로 블로그 만들기</h1>
<p>Next.js는 React 기반의 풀스택 프레임워크로, 블로그 같은 웹사이트를 쉽게 만들 수 있습니다.</p>
<h2>주요 기능</h2>
<ul>
  <li>서버 사이드 렌더링</li>
  <li>정적 사이트 생성</li>
  <li>API 라우트</li>
  <li>파일 기반 라우팅</li>
</ul>
<p>이 글에서는 Next.js를 사용하여 블로그를 만드는 방법을 자세히 설명하겠습니다.</p>`,
    date: '2025-04-19',
    category: '개발',
    image_url: undefined
  }
];

export async function GET() {
  try {
    // 테이블 생성
    const tableResult = await createPostsTable();
    if (!tableResult.success) {
      return NextResponse.json(
        { error: '테이블 생성 실패' },
        { status: 500 }
      );
    }
    
    // 샘플 포스트 추가
    const addedPosts = [];
    for (const post of samplePosts) {
      try {
        const result = await addPost(post);
        addedPosts.push(result);
      } catch (error) {
        console.error('샘플 포스트 추가 실패:', error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '데이터베이스 설정 완료',
      posts: addedPosts
    });
    
  } catch (error) {
    console.error('데이터베이스 설정 오류:', error);
    return NextResponse.json(
      { error: '데이터베이스 설정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 