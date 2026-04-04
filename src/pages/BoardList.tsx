import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, MessageSquare } from "lucide-react";
import { Post, DUMMY_POSTS as dummyPosts } from "@/lib/boardData";

const categories = ["전체", "공지사항", "건의사항", "비품관리", "대타요청", "일반 게시글"];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "공지사항": { bg: '#E8F3FF', color: '#4261FF' },
  "건의사항": { bg: '#ECFFF1', color: '#1EDC83' },
  "비품관리": { bg: '#FDF9DF', color: '#FFB300' },
  "대타요청": { bg: '#FFEAE6', color: '#FF3D3D' },
  "일반 게시글": { bg: '#F7F7F8', color: '#AAB4BF' },
};

export default function BoardList() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = dummyPosts.filter(
    (p) => (selectedCategory === "전체" || p.category === selectedCategory) &&
      (searchQuery === "" || p.title.includes(searchQuery) || p.content.includes(searchQuery))
  );

  const notices = filtered.filter((p) => p.category === "공지사항");
  const others = filtered.filter((p) => p.category !== "공지사항");

  return (
    <div className="max-w-lg mx-auto min-h-screen" style={{ backgroundColor: '#F7F7F8' }}>
      <div style={{ backgroundColor: '#F7F7F8', paddingBottom: 'calc(74px + env(safe-area-inset-bottom) + 20px)' }}>
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 px-2 pt-4 pb-2">
          <button onClick={() => navigate("/")} className="pressable p-1">
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: '#19191B' }}>게시판</h1>
        </div>
        <div className="border-b border-border" />
      </div>

      <div className="px-5 pt-3 pb-[calc(96px+env(safe-area-inset-bottom))]">
        <div className="relative mb-4">
          <input type="text" placeholder="게시글 검색" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-white pl-4 pr-10 focus:outline-none focus:border-primary"
            style={{ height: '44px', fontSize: '14px', color: '#19191B', letterSpacing: '-0.02em' }} />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className="pressable flex-shrink-0 rounded-full px-3 py-1.5"
                style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '-0.02em', border: `1px solid ${isActive ? '#4261FF' : '#DBDCDF'}`, backgroundColor: isActive ? '#E8F3FF' : '#FFFFFF', color: isActive ? '#4261FF' : '#AAB4BF' }}>
                {cat}
              </button>
            );
          })}
        </div>

        {notices.length > 0 && (selectedCategory === "전체" || selectedCategory === "공지사항") && (
          <>
            <p style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', color: '#19191B', marginBottom: '12px' }}>공지사항</p>
            <div className="flex flex-col gap-3 mb-6">
              {notices.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </>
        )}

        {others.length > 0 && (
          <>
            {selectedCategory === "전체" && (
              <p style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', color: '#19191B', marginBottom: '12px' }}>전체 게시글</p>
            )}
            <div className="flex flex-col gap-3">
              {others.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <span style={{ fontSize: '14px', color: '#AAB4BF' }}>게시글이 없어요.</span>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          const btn = document.activeElement as HTMLElement;
          btn?.blur();
          setTimeout(() => navigate("/board/write"), 220);
        }}
        className="pressable"
        style={{
          position: 'fixed',
          bottom: 'calc(74px + env(safe-area-inset-bottom) + 16px)',
          right: '20px',
          zIndex: 50,
          width: 'clamp(52px, 14.9vw, 56px)',
          height: 'clamp(52px, 14.9vw, 56px)',
          borderRadius: '50%',
          backgroundColor: '#4261FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(66,97,255,0.4)',
          transition: 'transform 0.2s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.2s',
          animation: 'fabPopIn 0.35s cubic-bezier(0.34,1.4,0.64,1)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(66,97,255,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(66,97,255,0.4)'; }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.93)'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.93)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(66,97,255,0.3)'; }}
        onTouchEnd={e => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(66,97,255,0.4)';
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 4v14M4 11h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <style>{`
          @keyframes fabPopIn {
            0%   { opacity: 0; transform: scale(0.6) rotate(-15deg); }
            60%  { transform: scale(1.12) rotate(4deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }
        `}</style>
      </button>

      </div>

    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();
  const catStyle = CATEGORY_COLORS[post.category] || { bg: '#F7F7F8', color: '#AAB4BF' };
  return (
    <div className="pressable rounded-2xl bg-white p-4 cursor-pointer" style={{ boxShadow: '2px 2px 12px rgba(0,0,0,0.06)' }}
      onClick={() => navigate(`/board/${post.id}`)}>
      <div className="flex items-start justify-between mb-2">
        <p style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: '#19191B' }}>{post.title}</p>
        <span className="flex-shrink-0 ml-2 rounded-md px-2 py-0.5"
          style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '-0.02em', backgroundColor: catStyle.bg, color: catStyle.color }}>
          {post.category}
        </span>
      </div>
      <p className="mb-3 line-clamp-2 whitespace-pre-line" style={{ fontSize: '13px', color: '#70737B', lineHeight: '1.5', letterSpacing: '-0.02em' }}>
        {post.content}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full px-2 py-0.5" style={{ fontSize: '12px', color: '#70737B', backgroundColor: '#F7F7F8' }}>{post.author}</span>
          {post.role && <span className="rounded-full px-2 py-0.5" style={{ fontSize: '12px', color: '#70737B', backgroundColor: '#F7F7F8' }}>{post.role}</span>}
          <span style={{ fontSize: '12px', color: '#AAB4BF' }}>| {post.date}</span>
        </div>
        <div className="flex items-center gap-1" style={{ color: '#AAB4BF' }}>
          <MessageSquare className="h-4 w-4" />
          <span style={{ fontSize: '12px' }}>{post.comments}</span>
        </div>
      </div>
    </div>
  );
}
