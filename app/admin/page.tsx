"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  title: string;
  slug: string;
  content: string;
  category: string;
  date: string;
};

export default function AdminPage() {
  // 보안 관련 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 이미지 업로드 관련 상태
  const [uploadedImages, setUploadedImages] = useState<{url: string, alt: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 포스트 관리 관련 상태
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState("");
  const [activeTab, setActiveTab] = useState<'write' | 'manage'>('write');

  // 인증 상태 확인
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 로그인 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 비밀번호 확인 (실제로는 서버에서 처리해야 함)
    if (password === 'admin1234') { // 간단한 비밀번호 설정
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setLoginError("");
    } else {
      setLoginError("비밀번호가 올바르지 않습니다.");
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  // 포스트 로딩
  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage') {
      fetchPosts();
    }
  }, [activeTab, isAuthenticated]);

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('포스트 데이터가 배열이 아닙니다:', data);
        setPosts([]);
      }
    } catch (err) {
      console.error('포스트 로딩 오류:', err);
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // 로그인되지 않은 경우 로그인 폼 표시
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {loginError && (
            <div className="text-red-500 text-sm">{loginError}</div>
          )}
          
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              로그인
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            홈페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const generateSlug = (text: string) => {
    // 한글을 영어로 변환하는 간단한 방식 (실제로는 좀 더 정교한 변환이 필요할 수 있음)
    const koreanToEnglish = {
      '회고': 'review',
      '개발': 'dev',
      '일상': 'daily',
      '여행': 'travel',
      '기술': 'tech',
      '프로젝트': 'project'
    };
    
    // 한글 단어를 영어로 대체
    let result = text;
    Object.entries(koreanToEnglish).forEach(([kor, eng]) => {
      result = result.replace(new RegExp(kor, 'g'), eng);
    });
    
    // 나머지 한글 및 특수문자 제거 후 영문, 숫자, 하이픈만 남김
    return result
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // 영문, 숫자, 공백, 하이픈만 허용
      .replace(/\s+/g, '-')         // 공백을 하이픈으로 변환
      .replace(/-+/g, '-')          // 연속된 하이픈 하나로 변환
      .trim();                      // 앞뒤 공백 제거
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!isEditMode) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const post = {
        title,
        slug,
        content,
        category,
        date: new Date().toISOString().split("T")[0],
      };
      
      const url = isEditMode ? `/api/posts/${currentEditId}` : '/api/posts';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "포스트 저장에 실패했습니다.");
      }
      
      setMessage(isEditMode ? "포스트가 성공적으로 수정되었습니다!" : "포스트가 성공적으로 저장되었습니다!");
      
      if (isEditMode) {
        setIsEditMode(false);
        setCurrentEditId("");
        // 관리 탭에서 포스트 목록 새로고침
        fetchPosts();
      }
      
      // 폼 초기화
      resetForm();
      
    } catch (err) {
      console.error("Error saving post:", err);
      setError(err instanceof Error ? err.message : "포스트 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      
      // 3초 후 메시지 초기화
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }
  };
  
  // 포스트 수정 시작
  const handleEditPost = (post: Post) => {
    setIsEditMode(true);
    setCurrentEditId(post.slug);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setCategory(post.category);
    setActiveTab('write');
    
    // 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
  };
  
  // 포스트 삭제
  const handleDeletePost = async (slug: string) => {
    if (!window.confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "포스트 삭제에 실패했습니다.");
      }
      
      // 성공 메시지 표시
      alert("포스트가 삭제되었습니다.");
      
      // 포스트 목록 새로고침
      fetchPosts();
      
      // 수정 모드였다면 폼 초기화
      if (isEditMode && currentEditId === slug) {
        resetForm();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err instanceof Error ? err.message : "포스트 삭제 중 오류가 발생했습니다.");
    }
  };
  
  // 폼 초기화
  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setCategory("");
    setUploadedImages([]);
    setIsEditMode(false);
    setCurrentEditId("");
  };
  
  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadError("");
    
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "이미지 업로드에 실패했습니다.");
      }
      
      // 업로드된 이미지 추가
      setUploadedImages(prev => [...prev, {
        url: data.filePath,
        alt: file.name
      }]);
      
      // 마크다운에 이미지 삽입
      const imageMarkdown = `![${file.name}](${data.filePath})`;
      setContent(prev => prev + (prev ? '\n\n' : '') + imageMarkdown);
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploadError(err instanceof Error ? err.message : "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };
  
  // 업로드된 이미지를 마크다운에 삽입
  const insertImageToMarkdown = (url: string, alt: string) => {
    const imageMarkdown = `![${alt}](${url})`;
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      const newText = text.substring(0, start) + imageMarkdown + text.substring(end);
      setContent(newText);
      
      // 커서 위치 조정
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
      }, 0);
    } else {
      setContent(prev => prev + (prev ? '\n\n' : '') + imageMarkdown);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">블로그 관리자</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          로그아웃
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">블로그 관리자</h1>
        
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← 홈으로 돌아가기
          </Link>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 ${
              activeTab === 'write' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('write')}
          >
            {isEditMode ? '포스트 수정' : '새 포스트 작성'}
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'manage' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('manage')}
          >
            포스트 관리
          </button>
        </div>
        
        {/* 알림 메시지 */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* 글 작성/수정 탭 */}
        {activeTab === 'write' && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {isEditMode && (
              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-700 dark:text-yellow-200">
                  '{currentEditId}' 포스트를 수정하고 있습니다.
                  <button
                    type="button"
                    onClick={resetForm}
                    className="ml-4 text-sm text-yellow-800 dark:text-yellow-100 underline"
                  >
                    취소하고 새 글 작성하기
                  </button>
                </p>
              </div>
            )}
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                슬러그 (URL)
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${isEditMode ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
                required
                disabled={isLoading || isEditMode}
              />
              {isEditMode && (
                <p className="text-sm text-gray-500 mt-1">수정 모드에서는 슬러그를 변경할 수 없습니다.</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                카테고리
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* 이미지 업로드 섹션 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                이미지 업로드
              </label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading || isLoading}
                  />
                  <label 
                    htmlFor="image-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "업로드 중..." : "이미지 선택"}
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG, GIF, WEBP (최대 5MB)
                  </span>
                </div>
                
                {uploadError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {uploadError}
                  </div>
                )}
                
                {/* 업로드된 이미지 미리보기 */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">업로드된 이미지</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-w-16 aspect-h-9 relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => insertImageToMarkdown(image.url, image.alt)}
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold"
                          >
                            본문에 삽입
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                내용 (마크다운)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "저장 중..." : isEditMode ? "수정하기" : "저장하기"}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                disabled={isLoading}
              >
                {isEditMode ? "수정 취소" : "초기화"}
              </button>
            </div>
          </form>
        )}
        
        {/* 포스트 관리 탭 */}
        {activeTab === 'manage' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">포스트 목록</h2>
            
            {isLoadingPosts ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">포스트 목록을 불러오는 중...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                <p>작성된 포스트가 없습니다.</p>
                <button 
                  className="mt-4 text-blue-600 dark:text-blue-400 underline"
                  onClick={() => setActiveTab('write')}
                >
                  첫 포스트 작성하기
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">제목</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">카테고리</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">날짜</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">작업</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {posts.map((post) => (
                      <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            href={`/blog/${post.slug}`} 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                            target="_blank"
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEditPost(post)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                          >
                            수정
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.slug)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => {
                  fetchPosts();
                }}
              >
                새로고침
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 