import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ReadingKingRank } from '../types';
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  Printer,
  X,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface ReadingKingModalProps {
  isOpen: boolean;
  onClose: () => void;
  topStudents: ReadingKingRank[];
  schoolName: string;
}

export const ReadingKingModal: React.FC<ReadingKingModalProps> = ({
  isOpen,
  onClose,
  topStudents,
  schoolName,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMonthName = new Date().toLocaleDateString('ko-KR', { month: 'long' });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          className="bg-slate-900 border border-indigo-500/30 text-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Background Glow Effects */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3 shadow-inner">
              <Crown className="w-4 h-4 mr-1.5 text-amber-400" />
              {currentMonthName} 이달의 명예 독서왕 명예의 전당
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100">
              🏆 독서왕 다독 학생 발표 🏆
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
              꾸준한 독서와 진정성 있는 기록으로 학급의 독서 문화를 빛낸 다독 학생을 축하합니다!
            </p>
          </div>

          {/* Top 3 Podium Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {topStudents.map((student) => {
              const isGold = student.rank === 1;
              const isSilver = student.rank === 2;
              const isBronze = student.rank === 3;

              return (
                <div
                  key={student.studentName + student.rank}
                  className={`p-5 rounded-2xl border relative flex flex-col justify-between transition-transform transform hover:-translate-y-1 shadow-lg ${
                    isGold
                      ? 'bg-gradient-to-b from-amber-950/80 to-slate-900 border-amber-500/60 ring-2 ring-amber-400/30'
                      : isSilver
                      ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-600/60'
                      : 'bg-gradient-to-b from-amber-950/30 to-slate-900 border-amber-800/40'
                  }`}
                >
                  {/* Rank Badge Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center ${
                        isGold
                          ? 'bg-amber-400 text-slate-950'
                          : isSilver
                          ? 'bg-slate-300 text-slate-950'
                          : 'bg-amber-700 text-amber-100'
                      }`}
                    >
                      {isGold && <Trophy className="w-3.5 h-3.5 mr-1" />}
                      {isSilver && <Award className="w-3.5 h-3.5 mr-1" />}
                      {isBronze && <Award className="w-3.5 h-3.5 mr-1" />}
                      {student.rank}위 ({student.badgeTitle})
                    </span>

                    <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                      총 {student.count}권 기록
                    </span>
                  </div>

                  {/* Student Info */}
                  <div className="my-2">
                    <p className="text-xs text-slate-400">{student.grade} {student.classNum}</p>
                    <h3 className="text-xl font-bold text-white flex items-center mt-0.5">
                      {student.studentName}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800 line-clamp-1">
                      <span className="text-slate-400">대표독서:</span> {student.recentBook || '다양한 도서'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 font-medium flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" /> 생각의 높이가 배로 자라났어요
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certificate Printable Preview Box */}
          <div id="printable-certificate" className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 mb-6 relative">
            <div className="border-2 border-dashed border-amber-500/40 p-6 rounded-xl text-center space-y-3">
              <div className="text-amber-400 text-xs font-bold tracking-widest uppercase">
                {schoolName} 상장 제 {new Date().getFullYear()}-01호
              </div>
              <h3 className="text-2xl font-bold text-white font-serif tracking-wider">
                독 서 상 장
              </h3>
              <p className="text-sm font-medium text-amber-200">
                [ {topStudents[0]?.grade || '5학년'} {topStudents[0]?.classNum || '2반'} 성명: <span className="text-white font-bold">{topStudents[0]?.studentName || '김민준'}</span> ]
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                위 학생은 꾸준한 독서 습관과 깊이 있는 독서록 작성으로 학급 독서 문화 조성에 모범이 되었으므로, {currentMonthName} 학급 이달의 독서왕 상장을 수여하며 높이 칭찬합니다.
              </p>
              <div className="pt-2 text-xs text-slate-400 flex items-center justify-center space-x-2">
                <span>{new Date().toLocaleDateString('ko-KR')}</span>
                <span>·</span>
                <span>담임교사 직인</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center transition-colors min-h-[44px]"
            >
              <Printer className="w-4 h-4 mr-2 text-indigo-400" />
              상장 및 축하 뱃지 출력하기
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all min-h-[44px]"
            >
              확인 및 닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
