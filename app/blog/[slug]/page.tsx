import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import fs from 'fs';
import path from 'path';

// 슬러그 디코딩
function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// 특정 포스트 가져오기
async function getPost(slug: string) {
  try {
    const decodedSlug = decodeSlug(slug);
    
    // 데이터 디렉토리 경로
    const postsDirectory = path.join(process.cwd(), 'data', 'posts');
    const filePath = path.join(postsDirectory, `${decodedSlug}.json`);
    
    // 파일이 존재하지 않으면 null 반환
    if (!fs.existsSync(filePath)) {
      console.log(`포스트 파일을 찾을 수 없음: ${filePath}`);
      return null;
    }
    
    // 파일 내용 읽기
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const post = JSON.parse(fileContent);
    console.log(`포스트 로딩 성공: ${decodedSlug}`);
    return post;
  } catch (error) {
    console.error(`포스트 조회 오류 (${slug}):`, error);
    return null;
  }
}

// 모든 포스트 가져오기 (관련 글용)
async function getAllPosts() {
  try {
    // 데이터 디렉토리 경로
    const postsDirectory = path.join(process.cwd(), 'data', 'posts');
    
    // 디렉토리가 없으면 빈 배열 반환
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    
    // 모든 JSON 파일을 읽어 포스트 목록 생성
    const files = fs.readdirSync(postsDirectory);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(postsDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      });
  } catch (error) {
    console.error('포스트 목록 조회 오류:', error);
    return [];
  }
}

// 모든 가능한 경로를 미리 생성
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // params는 이미 준비된 객체이므로 await가 필요하지 않지만,
  // 경고를 해결하기 위해 다음과 같이 구조 분해 할당으로 변경
  const { slug } = params;
  const decodedSlug = decodeSlug(slug);
  console.log('현재 접근 중인 슬러그:', decodedSlug);
  
  // 실제 저장된 포스트 찾기
  const post = await getPost(decodedSlug);
  
  // 모든 포스트 가져오기 (관련 글용)
  const allPosts = await getAllPosts();
  
  if (!post) {
    console.log(`포스트를 찾을 수 없음: ${decodedSlug}`);
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 이미지 헤더 */}
      <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-8 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          {/* 배경 패턴 효과 */}
          <div className="absolute inset-0 bg-white opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM20 20h20v20H20V20zm10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z\' fill=\'%23000000\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="text-center z-10">
          <span className="inline-block bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white px-4 max-w-3xl">
            {post.title}
          </h1>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-1">
          {/* 글 헤더 */}
          <header className="mb-8">
            <div className="mb-6">
              <Link 
                href="/blog" 
                className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                블로그 목록으로
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600 mb-8">
              <time className="text-sm">{post.date}</time>
            </div>
          </header>
          
          {/* 글 내용 */}
          <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-md">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </article>
          
          {/* 공유 및 태그 */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-gray-700 font-medium">태그:</span>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                {post.category}
              </span>
            </div>
            
            <div className="flex gap-4 items-center">
              <span className="text-gray-700 font-medium">공유:</span>
              <div className="flex gap-2">
                <button className="text-gray-600 hover:text-blue-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-blue-700 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-blue-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">목차</h3>
              <ul className="space-y-2 text-sm">
                {post.content?.match(/#{1,3} (.*)/g)?.map((heading: string, index: number) => {
                  const level = heading.match(/^#+/)?.[0].length || 1;
                  const text = heading.replace(/^#+\s+/, '');
                  return (
                    <li key={index} className={`${level === 1 ? '' : level === 2 ? 'ml-3' : 'ml-6'}`}>
                      <a href={`#${text.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600 transition-colors">
                        {text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {/* 관련 글 */}
            {allPosts.length > 1 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">관련 글</h3>
                <div className="space-y-4">
                  {allPosts
                    .filter(p => p.slug !== decodedSlug)
                    .slice(0, 3)
                    .map((relatedPost, index) => (
                      <div key={`${relatedPost.slug}-${index}`} className="group">
                        <Link href={`/blog/${relatedPost.slug}`} className="block">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                              {relatedPost.category[0]}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <time className="text-xs text-gray-500">{relatedPost.date}</time>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
} 