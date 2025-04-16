import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

// 이미지 저장 경로 설정
const imagesDirectory = path.join(process.cwd(), 'public', 'uploads');

// 디렉토리가 없으면 생성
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 확장자 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원되지 않는 파일 형식입니다.' },
        { status: 400 }
      );
    }

    // 파일 이름 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${timestamp}-${originalName}`;

    // 파일 경로
    const filePath = path.join(imagesDirectory, fileName);
    const relativePath = `/uploads/${fileName}`;

    // 파일 내용 가져오기
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 저장
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      filePath: relativePath,
    });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 