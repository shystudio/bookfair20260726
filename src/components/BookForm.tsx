import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookLog } from '../types';
import { BOOK_CATEGORIES, SEL_ENCOURAGEMENT_QUOTES } from '../data/mockData';
import { QuoteCarousel } from './QuoteCarousel';
import {
  PenTool,
  BookOpen,
  User,
  GraduationCap,
  Building,
  Send,
  RotateCcw,
  Star,
  Sparkles,
  CheckCircle2,
  FileText,
  HeartHandshake,
  BookMarked,
  Flame,
  Lightbulb
} from 'lucide-react';

interface BookFormProps {
  defaultGrade: string;
  defaultClassNum: string;
  onSubmitLog: (log: Omit<BookLog, 'id' | 'createdAt'>) => Promise<void>;
  isGasConnected: boolean;
  initialBookData?: { title: string; author: string; publisher: string; category?: string } | null;
}

export const BookForm: React.FC<BookFormProps> = ({
  defaultGrade,
  defaultClassNum,
  onSubmitLog,
  isGasConnected,
  initialBookData,
}) => {
  const [grade, setGrade] = useState(defaultGrade || '5학년');
  const [classNum, setClassNum] = useState(defaultClassNum || '2반');
  const [studentName, setStudentName] = useState('');
  const [bookTitle, setBookTitle] = useState(initialBookData?.title || '');
  const [author, setAuthor] = useState(initialBookData?.author || '');
  const [publisher, setPublisher] = useState(initialBookData?.publisher || '');
  const [category, setCategory] = useState(initialBookData?.category || '문학');
  const [rating, setRating] = useState(5);
  const [summary, setSummary] = useState('');
  const [reflection, setReflection] = useState('');

  React.useEffect(() => {
    if (initialBookData) {
      if (initialBookData.title) setBookTitle(initialBookData.title);
      if (initialBookData.author) setAuthor(initialBookData.author);
      if (initialBookData.publisher) setPublisher(initialBookData.publisher);
      if (initialBookData.category) {
        // Map category if needed
        setCategory(initialBookData.category.includes('어린이') || initialBookData.category.includes('소설') ? '문학' : initialBookData.category);
      }
    }
  }, [initialBookData]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleReset = () => {
    setBookTitle('');
    setAuthor('');
    setPublisher('');
    setSummary('');
    setReflection('');
    setRating(5);
    setCategory('문학');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!studentName.trim()) {
      setErrorMessage('작성 학생 이름을 입력해주세요.');
      return;
    }
    if (!bookTitle.trim()) {
      setErrorMessage('도서명을 입력해주세요.');
      return;
    }
    if (!author.trim()) {
      setErrorMessage('지은이(저자)를 입력해주세요.');
      return;
    }
    if (!summary.trim() || summary.trim().length < 10) {
      setErrorMessage('줄거리를 최소 10자 이상 작성해주세요.');
      return;
    }
    if (!reflection.trim() || reflection.trim().length < 10) {
      setErrorMessage('소감 및 느낀 점을 최소 10자 이상 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitLog({
        grade,
        classNum,
        studentName: studentName.trim(),
        bookTitle: bookTitle.trim(),
        author: author.trim(),
        publisher: publisher.trim(),
        category,
        rating,
        summary: summary.trim(),
        reflection: reflection.trim(),
      });

      setIsSubmittedSuccess(true);
      setTimeout(() => {
        setIsSubmittedSuccess(false);
        handleReset();
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Select a random SEL quote for encouragement
  const randomQuote = SEL_ENCOURAGEMENT_QUOTES[Math.floor(Math.random() * SEL_ENCOURAGEMENT_QUOTES.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* 1. Dynamic Reading Quotes Carousel Banner */}
      <QuoteCarousel />

      {/* 2. Welcome & Bookstore Ambience Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <BookMarked className="w-4 h-4 text-amber-400" />
              <span>우리반 감성 독서 서점 및 기록장</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center">
              독서록 작성하기 <PenTool className="w-5 h-5 ml-2.5 text-indigo-400 inline" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              오늘 읽은 책의 울림과 생각을 나만의 기록으로 남겨보세요.
            </p>
          </div>

          <div className="flex items-center px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 shadow-inner">
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isGasConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isGasConnected ? '구글 시트 실시간 저장' : '내 브라우저 안전 저장'}
          </div>
        </div>

        {/* Bookstore Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center space-x-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span>이달의 독서왕 도전 이벤트</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>선생님의 따뜻한 피드백 전달</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>실시간 학급 구글 시트 연동</span>
          </div>
        </div>
      </div>

      {/* Success Message Card Animation */}
      {isSubmittedSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-emerald-950/80 border-2 border-emerald-500/60 text-center space-y-4 shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            독서록이 성공적으로 등록되었습니다! 🎉
          </h3>
          <p className="text-sm text-emerald-200 font-medium">
            "{randomQuote}"
          </p>
          <p className="text-xs text-slate-400">
            잠시 후 새로운 독서록 작성을 위해 폼이 정리됩니다...
          </p>
        </motion.div>
      ) : (
        /* Form Box */
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm font-medium flex items-center">
              <span className="mr-2">⚠️</span> {errorMessage}
            </div>
          )}

          {/* Section 1: Student Metadata */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-indigo-300 font-bold text-sm">
              <User className="w-4 h-4 text-indigo-400" />
              <span>1. 작성자 학생 정보</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  학년 <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                  >
                    {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  반 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                  placeholder="예: 2반"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  학생 이름 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="예: 김민준"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Book Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-indigo-300 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>2. 도서 상세 정보</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  도서명 (책 제목) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="예: 어린 왕자"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  지은이 (저자) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 앙투안 드 생텍쥐페리"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  출판사
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="예: 열린책들"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  도서 분야 / 카테고리
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                >
                  {BOOK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  책 추천 별점
                </label>
                <div className="flex items-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 min-h-[44px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-2">
                    {rating}점 {rating === 5 ? '(최고예요!)' : rating >= 4 ? '(좋아요)' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Summary and Reflection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-indigo-300 font-bold text-sm">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>3. 내용 요약 및 나의 소감</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  줄거리 (책의 주요 내용 요약) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {summary.length}자 입력
                </span>
              </div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                placeholder="책에서 어떤 일들이 일어났나요? 주요 등장인물과 줄거리를 핵심 위주로 요약해보세요."
                className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center">
                  <HeartHandshake className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  소감 및 느낀 점 (나의 생각) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {reflection.length}자 입력
                </span>
              </div>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={4}
                placeholder="가장 인상 깊었던 장면이나 대사는 무엇인가요? 책을 읽고 깨달은 점이나 내 삶에 다짐한 내용을 솔직하게 자유롭게 적어보세요."
                className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Form Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium flex items-center justify-center transition-colors min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 작성하기
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-all disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  전송 및 저장 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  독서록 제출하기 🚀
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};
