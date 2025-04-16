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

// 임시 데이터
const postsTemp = [
  {
    id: 1,
    title: "2년차 개발자의 이직Log",
    slug: "job-change-log",
    date: "2023-03-15",
    category: "커리어",
    content: `
# 2년차 개발자의 이직 로그

안녕하세요, 저는 2년차 프론트엔드 개발자입니다. 최근에 이직을 완료했고, 그 과정에서 배운 점과 경험을 공유하고자 합니다.

## 이직을 결심한 이유

첫 회사에서 2년간 일하면서 많은 것을 배웠지만, 다음과 같은 이유로 이직을 결심했습니다:

1. 기술 스택의 한계
2. 성장 가능성의 제한
3. 새로운 도전에 대한 갈망

## 준비 과정

### 1. 포트폴리오 정비

이력서와 포트폴리오를 정비하는 데 약 2주가 소요되었습니다. 주요 프로젝트와 기여한 부분을 명확히 정리했습니다.

### 2. 기술 면접 준비

- JavaScript 핵심 개념 복습
- React와 관련 라이브러리 심화 학습
- CS 기초 지식 보강
- 알고리즘 문제 풀이

### 3. 지원 과정

총 8개 회사에 지원하여 다음과 같은 결과를 얻었습니다:

- 서류 탈락: 2곳
- 1차 면접 탈락: 3곳
- 최종 합격: 3곳

## 면접에서 자주 받은 질문

1. 클로저(Closure)란 무엇인가요?
2. React의 가상 DOM이 실제 DOM보다 빠른 이유는 무엇인가요?
3. 최근에 가장 어려웠던 기술적 문제와 해결 방법은?
4. 협업 과정에서 갈등이 있었던 경험과 해결 방법은?

## 최종 선택 기준

1. 기술 스택의 현대성
2. 성장 가능성
3. 회사 문화
4. 보상 체계

## 느낀 점

이직 과정은 쉽지 않았지만, 자신을 돌아보고 성장할 수 있는 좋은 기회였습니다. 준비 과정에서 많은 공부를 하게 되어 기술적으로도 한 단계 성장할 수 있었습니다.

여러분도 이직을 고민하고 계신다면, 충분한 준비와 자신감을 가지고 도전해보세요. 새로운 환경에서의 도전은 더 큰 성장을 가져올 것입니다.
    `
  },
  {
    id: 4,
    title: "2025년 1분기 회고",
    slug: "2025-q1-retrospective",
    date: "2025-04-01",
    category: "회고",
    content: `
# 2025년 1분기 회고

2025년의 첫 3개월을 보내며 개인적인 성장과 프로젝트에 대한 회고를 작성합니다.

## 주요 성과

1. Next.js 프로젝트 2개 완료
2. 오픈 소스 프로젝트에 5개의 PR 기여
3. 기술 블로그 글 10편 작성

## 배운 점

이번 분기에는 특히 다음과 같은 기술과 개념을 깊이 있게 학습했습니다:

- Server Components 아키텍처
- 타입스크립트 고급 기법
- 마이크로 프론트엔드 아키텍처

## 아쉬운 점

1. 건강 관리에 소홀했던 점
2. 독서 목표를 달성하지 못한 점
3. 일부 프로젝트의 일정 지연

## 다음 분기 목표

1. 주 3회 이상 운동하기
2. 월 2권 이상 책 읽기
3. WebAssembly 학습하기
4. 사이드 프로젝트 하나 완성하기

이번 분기는 전반적으로 만족스러운 성과를 거두었지만, 일과 삶의 균형에 좀 더 신경 써야겠다는 생각이 듭니다. 다음 분기에는 더 체계적인 계획과 실행으로 더 나은 결과를 만들어내고 싶습니다.
    `
  }
];

// 모든 가능한 경로를 미리 생성
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tempSlugs = postsTemp.map(post => ({ slug: post.slug }));
  
  const savedSlugs = posts.map(post => ({
    slug: post.slug,
  }));
  
  return [...savedSlugs, ...tempSlugs];
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeSlug(params.slug);
  console.log('현재 접근 중인 슬러그:', decodedSlug);
  
  // 실제 저장된 포스트 찾기
  const savedPost = await getPost(decodedSlug);
  
  // 모든 포스트 가져오기 (관련 글용)
  const allSavedPosts = await getAllPosts();
  
  // 저장된 포스트가 있으면 사용, 없으면 임시 데이터에서 찾기
  const post = savedPost || postsTemp.find(post => post.slug === decodedSlug);
  const allPosts = allSavedPosts.length > 0 ? allSavedPosts : postsTemp;
  
  if (!post) {
    console.log(`포스트를 찾을 수 없음: ${decodedSlug}`);
    notFound();
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* 글 헤더 */}
      <header className="mb-8">
        <div className="mb-4">
          <Link 
            href="/blog" 
            className="text-blue-600 dark:text-blue-500 hover:underline mb-4 inline-block"
          >
            ← 블로그 목록으로
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
          <time>{post.date}</time>
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {post.category}
          </span>
        </div>
      </header>
      
      {/* 글 내용 */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {post.content}
        </ReactMarkdown>
      </article>
      
      {/* 공유 및 태그 */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-gray-700 dark:text-gray-300">태그:</span>
          <button className="px-2 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
            {post.category}
          </button>
        </div>
        
        <div className="flex gap-2">
          <span className="text-gray-700 dark:text-gray-300">공유:</span>
          <button className="text-blue-600 dark:text-blue-500 hover:underline">Twitter</button>
          <button className="text-blue-600 dark:text-blue-500 hover:underline">Facebook</button>
          <button className="text-blue-600 dark:text-blue-500 hover:underline">LinkedIn</button>
        </div>
      </div>
      
      {/* 관련 글 */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">관련 글</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allPosts
            .filter(p => p.slug !== decodedSlug)
            .slice(0, 2)
            .map((relatedPost, index) => (
              <Link key={relatedPost.slug || index} href={`/blog/${relatedPost.slug}`}>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition">
                  <h4 className="font-semibold mb-2">{relatedPost.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <time>{relatedPost.date}</time>
                    <span className="mx-2">•</span>
                    <span>{relatedPost.category}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
} 