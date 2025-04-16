"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Post 타입 정의
type Post = {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  category: string;
};

export default function Home() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 3;

  // 클라이언트 사이드에서 데이터 가져오기
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error('포스트를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllPosts(data);
        }
      } catch (error) {
        console.error('포스트 로딩 오류:', error);
        setAllPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  // 베스트 컨텐츠 스크롤 핸들러
  const handleFeaturedPrev = () => {
    setFeaturedIndex(prev => 
      prev === 0 ? Math.max(0, Math.ceil(allPosts.length / postsPerPage) - 1) : prev - 1
    );
  };
  
  const handleFeaturedNext = () => {
    setFeaturedIndex(prev => 
      prev >= Math.ceil(allPosts.length / postsPerPage) - 1 ? 0 : prev + 1
    );
  };
  
  // 현재 페이지에 표시할 포스트
  const currentFeaturedPosts = allPosts.slice(
    featuredIndex * postsPerPage, 
    Math.min((featuredIndex + 1) * postsPerPage, allPosts.length)
  );
  
  // 페이지네이션 인디케이터
  const renderPaginationDots = (current: number, total: number) => {
    const dots = [];
    const totalPages = Math.ceil(total / postsPerPage);
    
    for (let i = 0; i < totalPages; i++) {
      dots.push(
        <div 
          key={i} 
          className={`w-2 h-2 rounded-full mx-1 ${
            i === current ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />
      );
    }
    
    return dots;
  };

  // 로딩 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 포스트가 없는 경우
  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col gap-16">
        {/* 히어로 섹션 */}
        <section className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">하고싶은게 많은 AI개발자</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            개발, 커리어, 그리고 일상에 대한 이야기를 공유합니다.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/blog"
              className="rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition"
            >
              글 목록 보기
            </Link>
            <Link 
              href="/about"
              className="rounded-full bg-gray-200 dark:bg-gray-800 px-6 py-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              소개 페이지
            </Link>
          </div>
        </section>

        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 mb-4">아직 게시된 포스트가 없습니다.</p>
          <Link 
            href="/admin"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            첫 포스트 작성하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16">
      {/* 히어로 섹션 */}
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">하고싶은게 많은 AI개발자</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          개발, 커리어, 그리고 일상에 대한 이야기를 공유합니다.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/blog"
            className="rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition"
          >
            글 목록 보기
          </Link>
          <Link 
            href="/about"
            className="rounded-full bg-gray-200 dark:bg-gray-800 px-6 py-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            소개 페이지
          </Link>
        </div>
      </section>

      {/* 베스트 컨텐츠 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">베스트 컨텐츠</h2>
          <Link 
            href="/blog"
            className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            더 보러가기
          </Link>
        </div>
        
        <div className="relative px-2 md:px-8">
          {/* 좌우 화살표 버튼 */}
          {allPosts.length > postsPerPage && (
            <>
              <button 
                onClick={handleFeaturedPrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 md:-ml-12 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all"
                aria-label="이전 컨텐츠"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handleFeaturedNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 md:-mr-12 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all"
                aria-label="다음 컨텐츠"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* 컨텐츠 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-6 md:px-10 transition-all duration-300 ease-in-out">
            {currentFeaturedPosts.map((post, index) => (
              <Link key={post.id || post.slug || index} href={`/blog/${post.slug}`}>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      미리보기 이미지
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-sm text-blue-600 dark:text-blue-500">{post.category}</span>
                    <h3 className="font-bold text-lg mt-1 mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.excerpt || post.content?.substring(0, 120) + '...'}</p>
                    <time className="text-xs text-gray-500 dark:text-gray-500">{post.date}</time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 페이지네이션 인디케이터 */}
          {allPosts.length > postsPerPage && (
            <div className="flex justify-center mt-6">
              <div className="flex">
                {renderPaginationDots(featuredIndex, allPosts.length)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 최신 컨텐츠 섹션은 삭제하고 베스트 컨텐츠만 표시 */}
    </div>
  );
}
