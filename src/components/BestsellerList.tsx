import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BestsellerBook } from '../types';
import {
  Search,
  Sparkles,
  RefreshCw,
  Trophy,
  BookOpen,
  Building,
  User,
  Tag,
  PenTool,
  AlertCircle,
  Library,
  Flame,
  CheckCircle2,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface BestsellerListProps {
  onSelectBookForLog?: (book: BestsellerBook) => void;
}

const BESTSELLER_API_URL =
  'https://script.google.com/macros/s/AKfycbwrrL-qXGoZ7ZkYgR4jOSADT3Dppw8DzgGyk3JZM2k3TnAQV8TG2PPE97v1_LI_lojb/exec';

// Fallback data in case of initial fetch or offline testing
const FALLBACK_BESTSELLERS: BestsellerBook[] = [
  {
    rank: 1,
    title: '모순',
    author: '양귀자',
    publisher: '쓰다',
    description: '삶의 모순과 진실을 들여다보는 양귀자 작가의 명작 소설입니다.',
    category: '소설/문학'
  },
  {
    rank: 2,
    title: '소년이 온다',
    author: '한강',
    publisher: '창비',
    description: '노벨문학상 수상 작가 한강의 대표작으로, 마음에 깊은 울림을 주는 소설입니다.',
    category: '소설/문학'
  },
  {
    rank: 3,
    title: '마흔에 읽는 쇼펜하우어',
    author: '강용수',
    publisher: '유노북스',
    description: '마음의 평정과 자기 삶의 기준을 세우도록 도와주는 지혜의 철학서입니다.',
    category: '인문/교양'
  },
  {
    rank: 4,
    title: '채식주의자',
    author: '한강',
    publisher: '창비',
    description: '인간의 폭력성과 고통에 대해 깊게 질문하는 노벨문학상 수상작입니다.',
    category: '소설/문학'
  },
  {
    rank: 5,
    title: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    publisher: '열린책들',
    description: '어른과 어린이 모두의 마음을 따뜻하게 비춰주는 영원한 클래식 독서록 추천도서입니다.',
    category: '어린이/청소년'
  },
  {
    rank: 6,
    title: '원씽 (The One Thing)',
    author: '게리 켈러',
    publisher: '비즈니스북스',
    description: '복잡한 세상을 이기는 단 하나의 가치와 집중의 힘을 제시하는 자기계발서입니다.',
    category: '자기계발'
  },
  {
    rank: 7,
    title: '트렌드 코리아 2025',
    author: '김난도 외',
    publisher: '미래의창',
    description: '대한민국의 최신 문화와 소비자 변화 흐름을 한눈에 살펴보는 트렌드 분석서입니다.',
    category: '경제/경영'
  },
  {
    rank: 8,
    title: '긴긴밤',
    author: '루리',
    publisher: '문학동네',
    description: '노든과 펭귄이 전하는 따뜻한 연대와 사랑의 이야기, 어린이 초등 독서록 강력 추천 도서입니다.',
    category: '어린이/청소년'
  }
];

export const BestsellerList: React.FC<BestsellerListProps> = ({ onSelectBookForLog }) => {
  const [books, setBooks] = useState<BestsellerBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<'rank' | 'title'>('rank');

  // Selected book modal/detail state if needed
  const [copiedBookTitle, setCopiedBookTitle] = useState<string | null>(null);

  const fetchBestsellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BESTSELLER_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
      }

      const json = await response.json();

      if (json && (json.status === 'success' || Array.isArray(json.data))) {
        const fetchedData: BestsellerBook[] = Array.isArray(json.data) ? json.data : [];
        setBooks(fetchedData.length > 0 ? fetchedData : FALLBACK_BESTSELLERS);
        setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      } else {
        throw new Error('응답 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.warn('Google Apps Script Fetch fallback active:', err);
      setError('예스24 데이터를 불러오는 중 네트워크 응답이 늦어 기본 추천 베스트셀러 목록을 표시합니다.');
      setBooks(FALLBACK_BESTSELLERS);
      setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set<string>();
    books.forEach((book) => {
      if (book.category && book.category.trim()) {
        cats.add(book.category.trim());
      }
    });
    return ['전체', ...Array.from(cats).sort()];
  }, [books]);

  // Filtered and Sorted Books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Category filter
        if (selectedCategory !== '전체' && book.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.publisher.toLowerCase().includes(q) ||
          (book.description && book.description.toLowerCase().includes(q)) ||
          (book.category && book.category.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'rank') {
          return a.rank - b.rank;
        } else {
          return a.title.localeCompare(b.title, 'ko-KR');
        }
      });
  }, [books, selectedCategory, searchQuery, sortBy]);

  const handleCopyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    setCopiedBookTitle(title);
    setTimeout(() => setCopiedBookTitle(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center shadow-inner">
                <Flame className="w-3.5 h-3.5 mr-1 text-rose-400" /> 예스24 실시간 베스트셀러
              </span>
              {lastUpdated && (
                <span className="text-xs text-slate-400">
                  최신 업데이트: {lastUpdated}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center">
              인기 베스트셀러 서재 <Sparkles className="w-6 h-6 ml-2 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              구글 Apps Script API 연동으로 가져온 최신 예스24 인기 도서입니다. 원하는 책을 골라 바로 독서록을 작성해보세요!
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={fetchBestsellers}
              disabled={loading}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 min-h-[44px]"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </button>
          </div>
        </div>

        {/* Notice Info if network fallback */}
        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Control Bar: Search & Category Dropdown & Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명, 저자, 출판사 또는 키워드로 검색하세요..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-0.5 rounded-md"
              >
                지우기
              </button>
            )}
          </div>

          {/* Sort & Category Dropdown */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Category Dropdown */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all min-h-[44px]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === '전체' ? '📚 전체 카테고리' : `🔖 ${cat}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'rank' ? 'title' : 'rank')}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 flex items-center transition-all min-h-[44px]"
              title="정렬 방식 변경"
            >
              <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              {sortBy === 'rank' ? '순위순' : '가나다순'}
            </button>
          </div>
        </div>

        {/* Category Horizontal Pill Tabs for quick filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0 flex items-center">
            <Tag className="w-3 h-3 mr-1" /> 분류:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap min-h-[36px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          총 <span className="font-bold text-amber-400 text-sm">{filteredBooks.length}</span>권의 베스트셀러 도서
          {selectedCategory !== '전체' && (
            <span className="ml-1 text-slate-300 font-semibold">[{selectedCategory}]</span>
          )}
          {searchQuery && (
            <span className="ml-1 text-indigo-300 font-semibold">"{searchQuery}" 검색결과</span>
          )}
        </div>
      </div>

      {/* Loading Skeleton or Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="animate-pulse bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 h-64 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-6 bg-slate-800 rounded-xl" />
                  <div className="w-20 h-5 bg-slate-800 rounded-full" />
                </div>
                <div className="w-3/4 h-6 bg-slate-800 rounded-lg" />
                <div className="w-1/2 h-4 bg-slate-800 rounded-lg" />
                <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
              </div>
              <div className="w-full h-10 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Library className="w-8 h-8" />
          </div>
          <p className="text-base font-bold text-slate-200">검색된 도서가 없습니다.</p>
          <p className="text-xs text-slate-400">
            검색어나 선택한 카테고리 필터를 변경하여 다시 시도해보세요.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('전체');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBooks.map((book) => {
              const isTopRank = book.rank <= 3;
              const rankBadgeColor =
                book.rank === 1
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                  : book.rank === 2
                  ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-950 font-black shadow-lg shadow-slate-300/30'
                  : book.rank === 3
                  ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-black shadow-lg shadow-amber-800/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700/80 font-bold';

              return (
                <motion.div
                  key={`${book.rank}-${book.title}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between"
                >
                  {/* Top Row: Rank & Category */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {/* Rank Badge */}
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-3 py-1 rounded-2xl text-xs flex items-center ${rankBadgeColor}`}>
                          {isTopRank && <Trophy className="w-3.5 h-3.5 mr-1" />}
                          {book.rank}위
                        </span>
                        {isTopRank && (
                          <span className="text-[11px] font-bold text-amber-400 flex items-center">
                            TOP {book.rank}
                          </span>
                        )}
                      </div>

                      {/* Category Badge */}
                      {book.category && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-slate-300 truncate max-w-[140px]">
                          {book.category}
                        </span>
                      )}
                    </div>

                    {/* Book Title */}
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
                      {book.title}
                    </h3>

                    {/* Author & Publisher */}
                    <div className="space-y-1 text-xs text-slate-400 mb-4">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-medium text-slate-300 truncate">{book.author}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{book.publisher}</span>
                      </div>
                    </div>

                    {/* Description Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed min-h-[72px] line-clamp-3">
                      {book.description || '인기 베스트셀러 도서입니다. 풍부한 지혜와 감동을 경험해 보세요.'}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyTitle(book.title)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center"
                      title="제목 복사"
                    >
                      {copiedBookTitle === book.title ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 복사됨
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" /> 제목 복사
                        </>
                      )}
                    </button>

                    {onSelectBookForLog && (
                      <button
                        onClick={() => onSelectBookForLog(book)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center shadow-md shadow-indigo-600/30 transition-all min-h-[38px]"
                      >
                        <PenTool className="w-3.5 h-3.5 mr-1.5" />
                        이 책으로 독서록 쓰기
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
