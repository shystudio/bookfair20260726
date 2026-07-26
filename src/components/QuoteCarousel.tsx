import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAMOUS_READING_QUOTES, ReadingQuote } from '../data/mockData';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bookmark,
  RefreshCw,
  Library,
  Feather
} from 'lucide-react';

export const QuoteCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FAMOUS_READING_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % FAMOUS_READING_QUOTES.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + FAMOUS_READING_QUOTES.length) % FAMOUS_READING_QUOTES.length);
  };

  const handleRandom = () => {
    setIsAutoPlay(false);
    const randomIndex = Math.floor(Math.random() * FAMOUS_READING_QUOTES.length);
    setCurrentIndex(randomIndex);
  };

  const currentQuote: ReadingQuote = FAMOUS_READING_QUOTES[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-slate-900 shadow-2xl my-6">
      {/* Background Decorative bookstore light glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-amber-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag Bar */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between border-b border-slate-800/80 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold shadow-inner">
            <Library className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> 오늘의 감성 독서 명언 서재
            </span>
            <p className="text-[11px] text-slate-400">책의 지혜가 마음에 스며드는 시간</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRandom}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center transition-all border border-slate-700/60 min-h-[36px]"
            title="새로운 명언 무작위 뽑기"
          >
            <RefreshCw className="w-3 h-3 mr-1 text-indigo-400" />
            <span className="hidden sm:inline">오늘의 명언 </span>뽑기
          </button>
        </div>
      </div>

      {/* Quote Card Display */}
      <div className="p-6 sm:p-10 relative z-10 min-h-[220px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Tag Badge */}
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center">
                <Bookmark className="w-3 h-3 mr-1 text-indigo-400" />
                {currentQuote.tag}
              </span>
            </div>

            {/* Quote Main Text */}
            <div className="relative">
              <Quote className="w-10 h-10 text-indigo-500/20 absolute -top-4 -left-3 pointer-events-none" />
              <p className="text-lg sm:text-2xl font-serif font-semibold text-slate-100 leading-relaxed tracking-wide italic pl-4 border-l-2 border-indigo-500/50">
                "{currentQuote.quote}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-2 pt-2 justify-end">
              <Feather className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                {currentQuote.author}
                <span className="text-slate-400 font-normal text-xs ml-1.5">
                  ({currentQuote.bookOrRole})
                </span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots and Arrows */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-4">
          <div className="flex items-center space-x-1.5">
            {FAMOUS_READING_QUOTES.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setIsAutoPlay(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-6 bg-indigo-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`${q.author} 명언 보기`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="이전 명언"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="다음 명언"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
