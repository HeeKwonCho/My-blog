"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Post = {
  id?: number | string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  category: string;
};

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 포스트 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error('포스트를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        
        // 포스트 데이터 설정
        setAllPosts(data);
        setFilteredPosts(data);
        
        // 카테고리 목록 추출
        const uniqueCategories = Array.from(new Set(data.map((post: Post) => post.category)));
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('포스트 로딩 오류:', error);
        // 오류 발생 시 임시 데이터 사용 (실제 서비스에서는 오류 표시 처리)
        setAllPosts([]);
        setFilteredPosts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // 카테고리 필터링 처리
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    
    if (category === null) {
      // '전체' 선택 시 모든 포스트 표시
      setFilteredPosts(allPosts);
    } else {
      // 특정 카테고리 선택 시 해당 카테고리 포스트만 필터링
      const filtered = allPosts.filter(post => post.category === category);
      setFilteredPosts(filtered);
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">블로그</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          개발, 커리어, 일상 등 다양한 주제의 글을 읽어보세요.
        </p>
      </section>
      
      {/* 카테고리 필터 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">카테고리</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-full ${selectedCategory === null 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-100'
            }`}
            onClick={() => handleCategoryFilter(null)}
          >
            전체
          </button>
          {categories.map(category => (
            <button 
              key={category} 
              className={`px-4 py-2 rounded-full ${selectedCategory === category 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-100'
              }`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
      
      {/* 블로그 포스트 목록 */}
      <section>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">게시물이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post, index) => (
              <Link key={post.slug || index} href={`/blog/${post.slug}`}>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {post.category}
                    </span>
                    <time className="text-xs text-gray-500 dark:text-gray-500 ml-2">{post.date}</time>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.excerpt || (post.content && post.content.substring(0, 150) + '...') || '내용 없음'}
                  </p>
                  <span className="text-blue-600 dark:text-blue-500 text-sm">더 읽기 →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      
      {/* 관리자 페이지 링크 */}
      <section className="mt-10 text-center">
        <Link 
          href="/admin"
          className="text-blue-600 dark:text-blue-500 hover:underline"
        >
          블로그 관리자 페이지
        </Link>
      </section>
    </div>
  );
} 