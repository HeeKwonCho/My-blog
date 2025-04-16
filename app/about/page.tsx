"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function AboutPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 페이지 로드 시 저장된 프로필 이미지 불러오기
  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      setProfileImage(data.filePath);
      
      // 로컬 스토리지에 이미지 경로 저장
      localStorage.setItem('profileImage', data.filePath);
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 선택 창 열기
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">개발자 소개</h1>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div 
            className="w-48 h-48 relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 mx-auto md:mx-0 cursor-pointer"
            onClick={handleImageClick}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            {isUploading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : profileImage ? (
              <Image 
                src={profileImage} 
                alt="프로필 이미지" 
                fill 
                sizes="(max-width: 768px) 100vw, 192px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                클릭하여 이미지 업로드
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">안녕하세요, AI 개발자입니다.</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              성능 최적화와 최신 기술 트렌드 동향 파악에 관심이 많은 AI 개발자입니다. 
              새로운 기술을 배우고 적용하는 것을 좋아하며, AI 트렌드에 뒤쳐지지 않게 노력하는 개발자입니다.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              이 페이지는 제가 배우고 경험한 것들을 공유하고, AI에 대해 기록하기 위해 만들었습니다.
              개발 관련 글 뿐만 아니라 일상과 취미, 생각 등 다양한 주제의 글을 작성합니다.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com/HeeKwonCho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition"
              >
                깃허브
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                링크드인
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">기술 스택</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'TailwindCSS', 'GraphQL', 'AWS'].map(tech => (
            <div key={tech} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
              {tech}
            </div>
          ))}
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">경력</h2>
        <div className="space-y-8">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h3 className="text-xl font-semibold">시니어 프론트엔드 개발자</h3>
            <p className="text-gray-600 dark:text-gray-400"></p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h3 className="text-xl font-semibold">프론트엔드 개발자</h3>
            <p className="text-gray-600 dark:text-gray-400"></p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">교육</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">정보통신공학 학사</h3>
            <p className="text-gray-600 dark:text-gray-400">한국외국어대학교 (2017 - 2025)</p>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">연락하기</h2>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            협업, 강연, 또는 기타 문의사항이 있으시면 아래 이메일로 연락해주세요.
          </p>
          <p className="font-semibold">vnfrpa@gmail.com</p>
          <div className="mt-6">
            <Link 
              href="/blog"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              블로그 글 보러가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 