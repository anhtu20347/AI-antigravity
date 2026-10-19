'use client';

import React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  PenTool, 
  HelpCircle, 
  Mic, 
  User, 
  MessageSquare, 
  Sparkles, 
  Home 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Tổng quan', icon: Home },
  { href: '/lesson', label: 'Học 4 Bước', icon: BookOpen },
  { href: '/tutor', label: 'AI Tutor & iPad', icon: PenTool },
  { href: '/quiz', label: 'Trắc nghiệm', icon: HelpCircle },
  { href: '/oral', label: 'Vấn đáp Voice', icon: Mic },
  { href: '/forum', label: 'Diễn đàn', icon: MessageSquare },
  { href: '/profile', label: 'Hồ sơ & Lỗi sai', icon: User },
  { href: '/admin', label: 'Sao chép 4 bước', icon: Sparkles },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b-4 border-ink px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-lav border-2 border-ink flex items-center justify-center text-xl shadow-retro">
            🦉
          </div>
          <div>
            <span className="font-black text-lg text-ink leading-tight block">Cú Đêm</span>
            <span className="text-[11px] font-bold text-indigo-900 block">AI Tutor Xác Suất Thống Kê</span>
          </div>
        </a>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 flex-wrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`btn-retro text-xs py-1.5 px-3 ${
                  isActive ? 'bg-lav' : 'bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
