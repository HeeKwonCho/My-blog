import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 데이터 저장 경로 설정
const dataDirectory = path.join(process.cwd(), 'data');
const postsDirectory = path.join(dataDirectory, 'posts');

// 디렉토리가 없으면 생성
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}

if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory);
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    
    // 필수 필드 검증
    if (!post.title || !post.slug || !post.content || !post.category) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 파일명에 사용할 형식의 날짜 생성
    const date = post.date || new Date().toISOString().split('T')[0];
    
    // 포스트 데이터 구성
    const postData = {
      title: post.title,
      slug: post.slug,
      date,
      category: post.category,
      content: post.content,
    };
    
    // JSON 파일로 저장
    const filePath = path.join(postsDirectory, `${post.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, post: postData });
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
    // 디렉토리가 없으면 빈 배열 반환
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json([]);
    }
    
    // 모든 JSON 파일을 읽어 포스트 목록 생성
    const files = fs.readdirSync(postsDirectory);
    const posts = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(postsDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('포스트 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '포스트 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 