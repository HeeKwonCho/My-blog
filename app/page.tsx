"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Post 타입 정의
type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  category: string;
};

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // API에서 포스트 가져오기
    fetch('/api/posts')
      .then(response => response.json())
      .then(data => {
        // 최신순으로 정렬
        if (data.length > 0) {
          const sortedPosts = [...data].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          // 주요 게시물은 처음 5개
          setFeaturedPosts(sortedPosts.slice(0, 5));
          
          // 최근 게시물은 그 다음 5개
          setRecentPosts(sortedPosts.slice(0, 5));
        }
        
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      });
  }, []);

  // 로딩 상태일 때
  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">블로그 컨텐츠를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      {/* 네비게이션 바 */}
      <nav className="container mx-auto flex justify-between items-center py-4 mb-8">
        <Link href="/" className="text-2xl font-bold">내 블로그</Link>
        <div className="flex gap-6">
          <Link href="/blog" className="hover:text-gray-500 transition-colors">블로그</Link>
          <Link href="/projects" className="hover:text-gray-500 transition-colors">프로젝트</Link>
          <Link href="/about" className="hover:text-gray-500 transition-colors">소개</Link>
        </div>
      </nav>
      
      {/* 히어로 섹션 */}
      <section className="container mx-auto text-center py-16 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">개발자 블로그</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          개발, 커리어, 그리고 일상에 대한 이야기를 공유합니다.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/blog"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            글 목록 보기
          </Link>
          <Link 
            href="/about"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            소개 페이지
          </Link>
        </div>
      </section>

      {/* 베스트 컨텐츠 */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">베스트 컨텐츠</h2>
            <Link 
              href="/blog"
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              더 보러가기
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredPosts.slice(0, 4).map((post) => (
              <div key={String(post.id)} className="group">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-full">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <div className="flex items-center justify-center h-40 md:h-48 bg-gray-200 text-gray-500">
                        미리보기 이미지
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="text-gray-500 text-sm">
                        {post.date}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 최신 컨텐츠 */}
      {recentPosts.length > 0 && (
        <section className="container mx-auto mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">최신 컨텐츠</h2>
            <Link 
              href="/blog"
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              더 보러가기
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {recentPosts.slice(0, 5).map((post) => (
              <div key={String(post.id)} className="group">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-full">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <div className="flex items-center justify-center h-40 md:h-48 bg-gray-200 text-gray-500">
                        미리보기 이미지
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="text-gray-500 text-sm">
                        {post.date}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 푸터 */}
      <footer className="container mx-auto mt-20 py-8 border-t border-gray-200 text-gray-500 text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>© {new Date().getFullYear()} 내 블로그. All rights reserved.</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-700 transition-colors">이력서</a>
            <a href="#" className="hover:text-gray-700 transition-colors">깃허브</a>
            <a href="#" className="hover:text-gray-700 transition-colors">링크드인</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

