"use client";

import Link from "next/link";
import { useTheme } from "./theme-provider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("현재 테마:", theme, "새 테마로 변경:", newTheme);
    setTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold hover:text-gray-700 dark:hover:text-gray-300">
            내 블로그
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              블로그
            </Link>
            <Link href="/projects" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              프로젝트
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              소개
            </Link>
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
            aria-label="테마 전환"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 