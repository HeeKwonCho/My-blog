export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">활동</h3>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                이력서
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                깃허브
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                링크드인
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                인스타그램
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-600 dark:text-gray-400">Email ✉️ </p>
              <p className="text-gray-600 dark:text-gray-400">your-email@example.com</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">뉴스레터</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">최신 글과 소식을 받아보세요.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="이메일 주소" 
                className="py-2 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md flex-grow"
              />
              <button className="py-2 px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                구독
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>Copyright © {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 