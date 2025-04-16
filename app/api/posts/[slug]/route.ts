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

// GET - 특정 포스트 조회
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const filePath = path.join(postsDirectory, `${slug}.json`);
    
    // 파일이 존재하지 않으면 404 반환
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 파일 내용 읽기
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const post = JSON.parse(fileContent);
    
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
    const filePath = path.join(postsDirectory, `${slug}.json`);
    
    // 파일이 존재하지 않으면 404 반환
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '수정할 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 수정할 포스트 데이터 가져오기
    const updatedPost = await request.json();
    
    // 필수 필드 검증
    if (!updatedPost.title || !updatedPost.content || !updatedPost.category) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 슬러그가 일치하는지 확인
    if (updatedPost.slug !== slug) {
      return NextResponse.json(
        { error: '슬러그를 변경할 수 없습니다.' },
        { status: 400 }
      );
    }
    
    // 포스트 데이터 구성
    const postData = {
      title: updatedPost.title,
      slug: updatedPost.slug,
      date: updatedPost.date,
      category: updatedPost.category,
      content: updatedPost.content,
    };
    
    // JSON 파일로 저장
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, post: postData });
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
    const filePath = path.join(postsDirectory, `${slug}.json`);
    
    // 파일이 존재하지 않으면 404 반환
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '삭제할 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 파일 삭제
    fs.unlinkSync(filePath);
    
    return NextResponse.json({ success: true, message: '포스트가 삭제되었습니다.' });
  } catch (error) {
    console.error('포스트 삭제 오류:', error);
    return NextResponse.json(
      { error: '포스트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 