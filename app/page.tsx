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
      <div className="text-center py-20">
        <div className="inline-block h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">블로그 컨텐츠를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="text-center py-16 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">개발자 블로그</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          개발, 커리어, 그리고 일상에 대한 이야기를 공유합니다.
        </p>
      </section>

      {/* 베스트 컨텐츠 */}
      {featuredPosts.length > 0 && (
        <section className="mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">베스트 컨텐츠</h2>
            <Link 
              href="/blog"
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              더 보러가기
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {featuredPosts.slice(0, 5).map((post) => (
              <div key={String(post.id)} className="group">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="bg-gray-900 rounded-lg overflow-hidden h-full text-white">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                      <div className="flex items-center justify-center h-40 md:h-48 bg-gray-800 text-gray-400">
                        미리보기 이미지
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <div className="text-gray-400 text-sm">
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
        <section className="mb-20">
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
                  <div className="bg-gray-900 rounded-lg overflow-hidden h-full text-white">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                      <div className="flex items-center justify-center h-40 md:h-48 bg-gray-800 text-gray-400">
                        미리보기 이미지
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <div className="text-gray-400 text-sm">
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
    </>
  );
}

