import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BookLog, FilterState } from '../types';
import { BOOK_CATEGORIES } from '../data/mockData';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  User,
  Calendar,
  Eye,
  Award,
  Grid,
  List,
  Sparkles,
  BookMarked
} from 'lucide-react';

interface MyLogsProps {
  logs: BookLog[];
  onSelectLog: (log: BookLog) => void;
}

export const MyLogs: React.FC<MyLogsProps> = ({ logs, onSelectLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeClass, setSelectedGradeClass] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'rating' | 'student'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique Grade+Class list for filter dropdown
  const gradeClassOptions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.grade && l.classNum) {
        set.add(`${l.grade} ${l.classNum}`);
      }
    });
    return Array.from(set).sort();
  }, [logs]);

  // Filter & Sort logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        // Search matching
        const term = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !term ||
          log.bookTitle.toLowerCase().includes(term) ||
          log.studentName.toLowerCase().includes(term) ||
          log.author.toLowerCase().includes(term) ||
          log.summary.toLowerCase().includes(term) ||
          log.reflection.toLowerCase().includes(term);

        // Grade/Class filter
        const matchesGradeClass =
          selectedGradeClass === 'all' ||
          `${log.grade} ${log.classNum}` === selectedGradeClass;

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' || log.category === selectedCategory;

        return matchesSearch && matchesGradeClass && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'student') {
          return a.studentName.localeCompare(b.studentName, 'ko');
        }
        return 0;
      });
  }, [logs, searchTerm, selectedGradeClass, selectedCategory, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookMarked className="w-4 h-4 text-indigo-400" />
            <span>누적 독서 기록 아카이브</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            나의 독서록 서재 📚
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            학급 친구들이 정성껏 읽고 작성한 도서 감상록을 마음껏 탐색해보세요.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm font-bold flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
            총 <span className="text-white text-base mx-1">{filteredLogs.length}</span> 건의 독서록
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors min-h-[36px] ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="카드형 보기"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors min-h-[36px] ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="리스트형 보기"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="도서명, 이름, 저자 검색..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>

          {/* Grade/Class Filter */}
          <div>
            <select
              value={selectedGradeClass}
              onChange={(e) => setSelectedGradeClass(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            >
              <option value="all">전체 학년/반 보기</option>
              {gradeClassOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            >
              <option value="all">전체 도서 분야</option>
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            >
              <option value="latest">최신 등록순</option>
              <option value="oldest">오래된 순</option>
              <option value="rating">별점 높은 순</option>
              <option value="student">학생 이름순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Display */}
      {filteredLogs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
          <p className="text-base font-semibold text-slate-300">
            조건에 맞는 독서록이 없습니다.
          </p>
          <p className="text-xs text-slate-500">
            검색어를 변경해보거나 [독서 기록하기] 탭에서 첫 번째 독서록을 작성해보세요!
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectLog(log)}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {log.grade} {log.classNum}
                    </span>
                    <span className="text-slate-300 font-semibold">{log.studentName}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px]">
                    {log.category || '문학'}
                  </span>
                </div>

                {/* Book Title */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {log.bookTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {log.author} 지음
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= log.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Reflection Snippet */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  "{log.reflection || log.summary}"
                </div>

                {/* Teacher Comment Badge if present */}
                {log.teacherComment && (
                  <div className="flex items-center px-2.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] font-medium">
                    <Award className="w-3.5 h-3.5 mr-1 text-amber-400 shrink-0" />
                    <span className="truncate">선생님 칭찬: {log.teacherComment}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                </span>

                <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                  상세보기 <Eye className="w-3 h-3 ml-1" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Compact List Layout */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 shadow-lg overflow-hidden">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="p-4 hover:bg-slate-800/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-indigo-300">{log.grade} {log.classNum} {log.studentName}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{log.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {log.bookTitle} <span className="text-xs font-normal text-slate-400">({log.author})</span>
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                    {log.reflection || log.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 border-t sm:border-0 border-slate-800 pt-2 sm:pt-0">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= log.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-xs text-indigo-400 font-semibold flex items-center">
                  상세보기 <Eye className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
