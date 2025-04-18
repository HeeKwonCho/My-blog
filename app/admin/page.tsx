"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
};

type MenuBarProps = {
  editor: ReturnType<typeof useEditor>;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 mb-2 bg-gray-50 dark:bg-gray-800 rounded-t-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-2 py-1 rounded ${editor.isActive('paragraph') ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        일반
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        목록
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        번호
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}`}
        type="button"
      >
        인용
      </button>
      <div>
        <label htmlFor="text-color" className="mr-1">글자색:</label>
        <input 
          type="color" 
          id="text-color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="rounded cursor-pointer w-8 h-7"
        />
      </div>
    </div>
  );
};

export default function AdminPage() {
  // 인증 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 포스트 상태
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  
  // UI 상태
  const [activeTab, setActiveTab] = useState('write');
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  // 이미지 업로드 상태
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // TipTap 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // 로그인 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 인증 체크 (실제 앱에서는 보안적으로 좀 더 강력한 방식 사용 필요)
    if (username === 'admin' && password === 'admin1234') {
      setIsAuthenticated(true);
      fetchPosts();
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };
  
  // 로그아웃 처리
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setEditMode(false);
    setCurrentPostId(null);
  };
  
  // 포스트 가져오기
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    setError('');
    
    try {
      const response = await fetch('/api/posts');
      
      if (!response.ok) {
        throw new Error('포스트를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setPosts(data);
      
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "포스트를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingPosts(false);
    }
  };
  
  // 슬러그 생성
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // 공백을 하이픈으로 변환
      .replace(/[^\w\-]+/g, '')       // 알파벳, 숫자, 하이픈 외 제거
      .replace(/\-\-+/g, '-')         // 중복된 하이픈 제거
      .replace(/^-+/, '')             // 시작 부분의 하이픈 제거
      .replace(/-+$/, '');            // 끝 부분의 하이픈 제거
  };
  
  // 제목 변경 시 자동 슬러그 생성
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!editMode || !currentPostId) {
      setSlug(generateSlug(newTitle));
    }
  };
  
  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const postData = {
        title,
        slug,
        excerpt,
        content,
        category,
        date: new Date().toISOString().split('T')[0],
      };
      
      const url = editMode
        ? `/api/posts/${currentPostId}`
        : '/api/posts';
        
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `포스트 ${editMode ? '수정' : '생성'} 중 오류가 발생했습니다.`);
      }
      
      // 성공 메시지 및 상태 초기화
      setMessage(`포스트가 성공적으로 ${editMode ? '수정' : '생성'}되었습니다!`);
      resetForm();
      
      // 포스트 목록 업데이트
      fetchPosts();
      
    } catch (err) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} post:`, err);
      setError(err instanceof Error ? err.message : `포스트 ${editMode ? '수정' : '생성'} 중 오류가 발생했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 포스트 수정 모드
  const handleEditPost = (post: Post) => {
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    if (editor) {
      editor.commands.setContent(post.content);
    }
    setCategory(post.category);
    setEditMode(true);
    setCurrentPostId(post.id);
    setActiveTab('write');
  };
  
  // 포스트 삭제 처리
  const handleDeletePost = async (slug: string) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까?')) {
      return;
    }
    
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "포스트 삭제 중 오류가 발생했습니다.");
      }
      
      fetchPosts();
      
      setMessage("포스트가 성공적으로 삭제되었습니다!");
      
      // 현재 수정 중이던 포스트가 삭제된 경우 폼 초기화
      const currentEditingPost = posts.find(post => post.id === currentPostId);
      if (editMode && currentEditingPost && currentEditingPost.slug === slug) {
        resetForm();
        setEditMode(false);
        setCurrentPostId(null);
      }
      
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err instanceof Error ? err.message : "포스트 삭제 중 오류가 발생했습니다.");
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    if (editor) {
      editor.commands.setContent('');
    }
    setCategory("");
    setEditMode(false);
    setCurrentPostId(null);
  };
  
  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editor) return;
    
    setIsUploading(true);
    setUploadError("");
    
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      
      // Using axios instead of fetch for better file upload support
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status !== 200) {
        throw new Error(response.data.error || "이미지 업로드에 실패했습니다.");
      }
      
      // 에디터에 이미지 삽입
      const imageUrl = response.data.filePath;
      editor.chain().focus().setImage({
        src: imageUrl,
        alt: files[0].name.split('.')[0]
      }).run();
      
      console.log("업로드 성공:", response.data);
      
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploadError(err instanceof Error ? err.message : "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      // 파일 입력 필드 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // 이미지 선택 버튼 클릭 처리
  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">블로그 관리자</h1>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            로그아웃
          </button>
        )}
      </div>
      
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← 홈으로 돌아가기
        </Link>
      </div>
      
      {!isAuthenticated ? (
        // 로그인 폼
        <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-6 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              아이디
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            로그인
          </button>
        </form>
      ) : (
        // 관리자 콘텐츠
        <>
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
              {editMode ? '포스트 수정' : '새 포스트 작성'}
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
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* 포스트 작성/수정 폼 */}
          {activeTab === 'write' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  제목
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-1">
                  슬러그 (URL)
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL에 사용될 고유 식별자입니다. 영문, 숫자, 하이픈만 사용 가능합니다.
                </p>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                  요약
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  카테고리
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 dark:text-white"
                  style={{ backgroundColor: 'transparent' }}
                  required
                >
                  <option value="" className="bg-white dark:bg-gray-800">카테고리 선택</option>
                  <option value="개발" className="bg-white dark:bg-gray-800">개발</option>
                  <option value="디자인" className="bg-white dark:bg-gray-800">디자인</option>
                  <option value="일상" className="bg-white dark:bg-gray-800">일상</option>
                  <option value="여행" className="bg-white dark:bg-gray-800">여행</option>
                  <option value="기술" className="bg-white dark:bg-gray-800">기술</option>
                  <option value="회고" className="bg-white dark:bg-gray-800">회고</option>
                </select>
              </div>
              
              {/* 파일 업로드 입력은 숨김 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  내용
                </label>
                <div className="mb-2">
                  <button
                    type="button"
                    onClick={handleImageButtonClick}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    이미지 업로드
                  </button>
                </div>
                
                {isUploading && (
                  <div className="text-sm text-gray-500 mb-2">
                    이미지 업로드 중...
                  </div>
                )}
                
                {uploadError && (
                  <div className="text-sm text-red-500 mb-2">
                    {uploadError}
                  </div>
                )}
                
                <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                  <MenuBar editor={editor} />
                  <div className="h-64 overflow-y-auto px-3 py-2">
                    <EditorContent 
                      editor={editor} 
                      className="focus:outline-none prose dark:prose-invert max-w-none prose-headings:my-2 prose-p:my-1 min-h-full" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading
                    ? '저장 중...'
                    : editMode
                      ? '포스트 수정'
                      : '포스트 저장'}
                </button>
                
                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    취소
                  </button>
                )}
              </div>
            </form>
          )}
          
          {/* 포스트 관리 */}
          {activeTab === 'manage' && (
            <div>
              <h2 className="text-xl font-bold mb-4">포스트 관리</h2>
              
              {isLoadingPosts ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                  <p className="mt-2 text-gray-500">포스트 로딩 중...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  등록된 포스트가 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          제목
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          슬러그
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          카테고리
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          작성일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          액션
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {posts.map((post) => (
                        <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{post.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{post.slug}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.slug)}
                              className="text-red-600 hover:text-red-900"
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
            </div>
          )}
        </>
      )}
    </div>
  );
} 